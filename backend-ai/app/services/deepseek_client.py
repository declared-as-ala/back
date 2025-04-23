from openai import OpenAI
from langdetect import detect
from difflib import get_close_matches
import re
from app.prompts.templates import get_prompt
from app.core.config import settings
from app.services.disease_matcher import (
    get_probable_diseases,
    get_disease_explanation,
    normalize_disease_key,
    original_keys,
    original_keys_lower,
)
from app.services.food_info import get_food_info

client = OpenAI(
    api_key=settings.openrouter_api_key, base_url="https://openrouter.ai/api/v1"
)

chat_history: dict[str, list[dict]] = {}
LANG_MAP = {"en": "English", "fr": "French", "ar": "Arabic"}


# Detect Arabic even if langdetect fails
def detect_language(text: str) -> str:
    if re.search(r"[\u0600-\u06FF]", text):
        return "Arabic"
    try:
        code = detect(text)
        return LANG_MAP.get(code[:2], "English")
    except:
        return "English"


# Translate food term to English using LLM (sync version)
def translate_to_english(text: str) -> str:
    prompt = f"Translate the following food name to English:\n\n{text.strip()}\n\nJust one word in English."

    response = client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": "You are a translation assistant."},
            {"role": "user", "content": prompt},
        ],
        extra_headers={"HTTP-Referer": "http://localhost", "X-Title": "FoodTranslator"},
    )

    return response.choices[0].message.content.strip().lower()


def get_response(session_id: str, user_input: str, chat_type: str) -> str:
    lang = detect_language(user_input)
    base_prompt = get_prompt(chat_type)
    system_prompt = f"{base_prompt}\nRespond in {lang}."
    history = chat_history.setdefault(session_id, [])

    # --- FOOD MODE ---
    if chat_type == "food":
        query = user_input.strip()

        if lang == "Arabic":
            query = translate_to_english(query)

        info = get_food_info(query)
        if info:
            return (
                f"**{info['name']}** per 100g:\n"
                f"- Calories: {info['calories']} kcal\n"
                f"- Fat: {info['fat_g']} g (Sat: {info['saturated_fat_g']} g)\n"
                f"- Carbs: {info['carbs_g']} g (Sugars: {info['sugars_g']} g)\n"
                f"- Protein: {info['protein_g']} g\n"
                f"- Fiber: {info['fiber_g']} g"
            )

        return {
            "English": f"Sorry, I don't have data on '{user_input}'. Try another food.",
            "French": f"Désolé, pas de données sur '{user_input}'. Essayez un autre aliment.",
            "Arabic": f"عذرًا، لا توجد بيانات عن '{user_input}'. حاول اسمًا آخر.",
        }.get(lang, "Sorry, no data found.")

    # --- EXPLORE MODE ---
    elif chat_type == "explore":
        raw = user_input.strip()

        if lang != "English":
            prompt = (
                f"You are a helpful medical assistant. "
                f"Please provide a concise overview of '{raw}': definition, symptoms, treatments, and red flags. Respond in {lang}."
            )
            overview = client.chat.completions.create(
                model=settings.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a knowledgeable doctor assistant.",
                    },
                    {"role": "user", "content": prompt},
                ],
                extra_headers={
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "MedChat Assistant",
                },
            )
            return overview.choices[0].message.content

        key = normalize_disease_key(raw)
        explanation = get_disease_explanation(key, raw)
        if explanation:
            return f"**{key.replace('_', ' ').title()}**\n\n{explanation}"

        cand = get_close_matches(raw.lower(), original_keys_lower, n=1, cutoff=0.6)
        if cand:
            orig = original_keys[original_keys_lower.index(cand[0])]
            expl2 = get_disease_explanation(normalize_disease_key(orig), orig)
            if expl2:
                return f"**{orig.title()}**\n\n{expl2}"

        fallback = client.chat.completions.create(
            model=settings.model_name,
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {
                    "role": "user",
                    "content": f"Provide a concise overview of '{raw}': definition, symptoms, treatments, and red flags. Respond in English.",
                },
            ],
            extra_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "MedChat Assistant",
            },
        )
        return fallback.choices[0].message.content

    # --- SYMPTOM MODE ---
    elif chat_type == "symptom":
        probable = get_probable_diseases(user_input)
        lines = [
            f"**{d['disease']} ({d['probability']})**\n- {d['reason']}"
            for d in probable
        ]
        context = (
            "Based on your symptoms, the most probable conditions are:\n\n"
            + "\n".join(lines)
            + "\n\nThis is not a medical diagnosis. Consult a professional."
        )
        user_input = context + "\n" + user_input

    # --- CHAT COMPLETION FOR OTHER CASES ---
    history.append({"role": "user", "content": user_input})
    recent = history[-6:]
    messages = [{"role": "system", "content": system_prompt}] + recent

    resp = client.chat.completions.create(
        model=settings.model_name,
        messages=messages,
        extra_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "MedChat Assistant",
        },
    )

    reply = resp.choices[0].message.content
    history.append({"role": "assistant", "content": reply})
    return reply
