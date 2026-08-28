import "./scss/main.scss";

import { getMealById } from "./js/api/mealApi";
import { toggleFavorite } from "./js/storage/favorites";
import { renderRecipeDetails } from "./js/ui/recipeDetails";

const recipeDetails = document.querySelector("#recipe-details");

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".recipe-details__favorite");

  if (!favoriteButton) {
    return;
  }

  const recipeId = favoriteButton.dataset.mealId;

  const isNowFavorite = toggleFavorite(recipeId);

  favoriteButton.classList.toggle("is-favorite", isNowFavorite);

  favoriteButton.setAttribute("aria-pressed", String(isNowFavorite));

  const favoriteText = favoriteButton.querySelector(
    ".recipe-details__favorite-text",
  );

  favoriteText.textContent = isNowFavorite ? "Saved" : "Save recipe";

  const recipeTitle = document
    .querySelector(".recipe-details__title")
    .textContent.trim();

  favoriteButton.setAttribute(
    "aria-label",
    isNowFavorite
      ? `Remove ${recipeTitle} from favorites`
      : `Add ${recipeTitle} to favorites`,
  );
}

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
      <p>
        Something went wrong. Please try again.
      </p>
    `;

    console.error("Failed to load recipe:", error);
  }
}

recipeDetails.addEventListener("click", handleFavoriteClick);

initRecipePage();
