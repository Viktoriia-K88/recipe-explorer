import "./scss/main.scss";

import { getMealById } from "./js/api/mealApi";

import { getFavoriteIds, toggleFavorite } from "./js/storage/favorites";

import { renderError, renderLoading, renderRecipes } from "./js/ui/recipes";

const favoritesGrid = document.querySelector("#favorites-grid");

function renderFavoritesEmpty() {
  favoritesGrid.replaceChildren();

  const emptyState = document.createElement("div");

  emptyState.className = "recipes-empty";

  const icon = document.createElement("span");

  icon.className = "recipes-empty__icon";

  icon.setAttribute("aria-hidden", "true");

  icon.textContent = "✦";

  const title = document.createElement("h2");

  title.className = "recipes-empty__title";

  title.textContent = "No favorites yet";

  const text = document.createElement("p");

  text.className = "recipes-empty__text";

  text.textContent = "Save recipes you love and they'll appear here.";

  const link = document.createElement("a");

  link.className = "recipes-empty__link";

  link.href = "./index.html";

  link.append(document.createTextNode("Explore recipes "));

  const arrow = document.createElement("span");

  arrow.setAttribute("aria-hidden", "true");

  arrow.textContent = "→";

  link.append(arrow);

  emptyState.append(icon, title, text, link);

  favoritesGrid.append(emptyState);
}

async function loadFavorites() {
  const favoriteIds = getFavoriteIds();

  if (favoriteIds.length === 0) {
    renderFavoritesEmpty();

    return;
  }

  renderLoading(favoritesGrid);

  try {
    const recipes = await Promise.all(favoriteIds.map((id) => getMealById(id)));

    const validRecipes = recipes.filter(Boolean);

    if (validRecipes.length === 0) {
      renderFavoritesEmpty();

      return;
    }

    renderRecipes(favoritesGrid, validRecipes);
  } catch (error) {
    renderError(favoritesGrid);

    console.error("Failed to load favorites:", error);
  }
}

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".recipe-card__favorite");

  if (!favoriteButton) {
    return;
  }

  const recipeId = favoriteButton.dataset.mealId;

  toggleFavorite(recipeId);

  loadFavorites();
}

favoritesGrid.addEventListener("click", handleFavoriteClick);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    loadFavorites();
  }
});

loadFavorites();
