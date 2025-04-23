"""
app/services/food_info.py

Provides lookup and nutrition info for foods using a local CSV dataset.
"""
import pandas as pd
from difflib import get_close_matches

# Load nutrition dataset
FOOD_DF = pd.read_csv("app/datasets/food_nutrition.csv")
# Normalize food names
FOOD_DF["key"] = FOOD_DF["food"].str.lower().str.strip()
FOOD_KEYS = FOOD_DF["key"].tolist()

def get_food_match(query: str) -> str:
    """Return the best matching food key or None."""
    q = query.lower().strip()
    matches = get_close_matches(q, FOOD_KEYS, n=1, cutoff=0.6)
    return matches[0] if matches else None


def get_food_info(name: str) -> dict:
    """Return nutrition info for the given food name or None."""
    key = get_food_match(name)
    if not key:
        return None
    row = FOOD_DF[FOOD_DF["key"] == key].iloc[0]
    # Extract relevant columns
    return {
        "name": row["food"],
        "calories": row["Caloric Value"],
        "fat_g": row["Fat"],
        "saturated_fat_g": row["Saturated Fats"],
        "carbs_g": row["Carbohydrates"],
        "sugars_g": row["Sugars"],
        "protein_g": row["Protein"],
        "fiber_g": row["Dietary Fiber"]
    }
