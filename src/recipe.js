import "./scss/main.scss";

import { getMealById } from "./js/api/mealApi";
import { renderRecipeDetails } from "./js/ui/recipeDetails";

const recipeDetails = document.querySelector("#recipe-details");

async function initRecipePage() {
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  if (!recipeId) {
    recipeDetails.innerHTML = `
      <p>Recipe not found.</p>
    `;

    return;
  }

  try {
    const recipe = await getMealById(recipeId);

    if (!recipe) {
      recipeDetails.innerHTML = `
        <p>Recipe not found.</p>
      `;

      return;
    }

    renderRecipeDetails(recipeDetails, recipe);

    document.title = `${recipe.strMeal} | Recipe Explorer`;
  } catch (error) {
    recipeDetails.innerHTML = `
      <p>Something went wrong. Please try again.</p>
    `;

    console.error("Failed to load recipe:", error);
  }
}

initRecipePage();
