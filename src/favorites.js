import "./scss/main.scss";

import { getMealById } from "./js/api/mealApi";
import { getFavoriteIds, toggleFavorite } from "./js/storage/favorites";

import { renderError, renderLoading, renderRecipes } from "./js/ui/recipes";

const favoritesGrid = document.querySelector("#favorites-grid");

function renderFavoritesEmpty() {
  favoritesGrid.innerHTML = `
    <div class="recipes-empty">
      <span
        class="recipes-empty__icon"
        aria-hidden="true"
      >
        ✦
      </span>

      <h2 class="recipes-empty__title">
        No favorites yet
      </h2>

      <p class="recipes-empty__text">
        Save recipes you love and they'll appear here.
      </p>

      <a
        class="recipes-empty__link"
        href="./index.html"
      >
        Explore recipes
        <span aria-hidden="true">→</span>
      </a>
    </div>
  `;
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

loadFavorites();
