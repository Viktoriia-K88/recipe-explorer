import "./scss/main.scss";

import { getMealById } from "./js/api/mealApi";

import { isFavorite, toggleFavorite } from "./js/storage/favorites";

import { renderRecipeDetails } from "./js/ui/recipeDetails";

const recipeDetails = document.querySelector("#recipe-details");

function renderRecipeStatus(titleText, descriptionText = "") {
  recipeDetails.replaceChildren();

  const status = document.createElement("div");

  status.className = "recipes-empty";

  const icon = document.createElement("span");

  icon.className = "recipes-empty__icon";

  icon.setAttribute("aria-hidden", "true");

  icon.textContent = "✦";

  const title = document.createElement("h1");

  title.className = "recipes-empty__title";

  title.textContent = titleText;

  status.append(icon, title);

  if (descriptionText) {
    const text = document.createElement("p");

    text.className = "recipes-empty__text";

    text.textContent = descriptionText;

    status.append(text);
  }

  recipeDetails.append(status);
}

function updateFavoriteButton(favoriteButton, favorite) {
  favoriteButton.classList.toggle("is-favorite", favorite);

  favoriteButton.setAttribute("aria-pressed", String(favorite));

  const favoriteText = favoriteButton.querySelector(
    ".recipe-details__favorite-text",
  );

  favoriteText.textContent = favorite ? "Saved" : "Save recipe";

  const recipeTitle = document
    .querySelector(".recipe-details__title")
    .textContent.trim();

  favoriteButton.setAttribute(
    "aria-label",
    favorite
      ? `Remove ${recipeTitle} from favorites`
      : `Add ${recipeTitle} to favorites`,
  );
}

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".recipe-details__favorite");

  if (!favoriteButton) {
    return;
  }

  const recipeId = favoriteButton.dataset.mealId;

  const favorite = toggleFavorite(recipeId);

  updateFavoriteButton(favoriteButton, favorite);
}

async function initRecipePage() {
  const params = new URLSearchParams(window.location.search);

  const recipeId = params.get("id");

  if (!recipeId) {
    renderRecipeStatus(
      "Recipe not found",
      "Return to Explore and choose another recipe.",
    );

    return;
  }

  renderRecipeStatus("Loading recipe...");

  try {
    const recipe = await getMealById(recipeId);

    if (!recipe) {
      renderRecipeStatus(
        "Recipe not found",
        "Return to Explore and choose another recipe.",
      );

      return;
    }

    renderRecipeDetails(recipeDetails, recipe);

    document.title = `${recipe.strMeal} | Recipe Explorer`;
  } catch (error) {
    renderRecipeStatus(
      "Something went wrong",
      "We couldn't load this recipe. Please try again.",
    );

    console.error("Failed to load recipe:", error);
  }
}

recipeDetails.addEventListener("click", handleFavoriteClick);

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    return;
  }

  const favoriteButton = document.querySelector(".recipe-details__favorite");

  if (!favoriteButton) {
    return;
  }

  const recipeId = favoriteButton.dataset.mealId;

  updateFavoriteButton(favoriteButton, isFavorite(recipeId));
});

initRecipePage();
