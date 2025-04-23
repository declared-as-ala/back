def get_prompt(chat_type: str) -> str:
    match chat_type:
        case "symptom":
            return (
                "You're a trusted AI health assistant. The user will describe symptoms. "
                "Ask relevant follow-up questions and offer possible explanations responsibly."
            )
        case "qa":
            return (
                "You're a licensed virtual doctor. Provide clear, evidence-based answers "
                "to general health and medical questions."
            )
        case "food":
            return "You're a certified nutritionist. Give food advice, including dietary concerns like diabetes or heart disease."
        case _:
            return "You're a helpful medical assistant."
