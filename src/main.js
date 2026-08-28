import "./scss/main.scss";

import {
  getCategories,
  getCuisines,
  getMealsByCategory,
  getMealsByCuisine,
  getRandomMeal,
  searchMealsByName,
} from "./js/api/mealApi";

import { renderCategories, renderCuisines } from "./js/ui/filters";

import { renderError, renderLoading, renderRecipes } from "./js/ui/recipes";

import { toggleFavorite } from "./js/storage/favorites";

// dom elements

const searchForm = document.querySelector(".search-form");

const searchInput = document.querySelector("#recipe-search");

const categoryFilter = document.querySelector("#category-filter");

const cuisineFilter = document.querySelector("#cuisine-filter");

const recipesSection = document.querySelector("#recipes");

const recipesGrid = document.querySelector("#recipes-grid");

const recipesCount = document.querySelector("#recipes-count");

const randomRecipeButton = document.querySelector("#random-recipe-button");

const loadMoreButton = document.querySelector("#load-more-button");

const RECIPES_PER_PAGE = 9;
const DEFAULT_CATEGORY = "Seafood";

// state

let currentRecipes = [];

let visibleRecipesCount = RECIPES_PER_PAGE;

let isFeaturedView = false;

// loading

function showLoadingState() {
  recipesCount.textContent = "";
  loadMoreButton.hidden = true;

  renderLoading(recipesGrid);
}

// error

function showErrorState(error) {
  currentRecipes = [];

  visibleRecipesCount = RECIPES_PER_PAGE;

  isFeaturedView = false;

  recipesCount.textContent = "";
  loadMoreButton.hidden = true;

  renderError(recipesGrid);

  console.error(error);
}

function updateRecipesView() {
  const visibleRecipes = currentRecipes.slice(0, visibleRecipesCount);

  renderRecipes(recipesGrid, visibleRecipes);

  if (currentRecipes.length === 0) {
    recipesCount.textContent = "";
    loadMoreButton.hidden = true;

    return;
  }

  const countLabel = isFeaturedView ? "featured recipes" : "recipes";

  recipesCount.textContent = `Showing ${visibleRecipes.length} of ${currentRecipes.length} ${countLabel}`;

  loadMoreButton.hidden = visibleRecipes.length >= currentRecipes.length;
}

function setRecipes(recipes, featured = false) {
  currentRecipes = recipes;

  visibleRecipesCount = RECIPES_PER_PAGE;

  isFeaturedView = featured;

  updateRecipesView();
}

function handleLoadMore() {
  visibleRecipesCount += RECIPES_PER_PAGE;

  updateRecipesView();
}

// favorites

function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".recipe-card__favorite");

  if (!favoriteButton) {
    return;
  }

  const recipeId = favoriteButton.dataset.mealId;

  const isNowFavorite = toggleFavorite(recipeId);

  favoriteButton.classList.toggle("is-favorite", isNowFavorite);

  favoriteButton.setAttribute("aria-pressed", String(isNowFavorite));

  const recipeCard = favoriteButton.closest(".recipe-card");

  const recipeName = recipeCard
    .querySelector(".recipe-card__title")
    .textContent.trim();

  favoriteButton.setAttribute(
    "aria-label",
    isNowFavorite
      ? `Remove ${recipeName} from favorites`
      : `Add ${recipeName} to favorites`,
  );
}

// filters

async function handleFiltersChange() {
  const category = categoryFilter.value;

  const cuisine = cuisineFilter.value;

  showLoadingState();

  try {
    if (category && cuisine) {
      const [categoryRecipes, cuisineRecipes] = await Promise.all([
        getMealsByCategory(category),
        getMealsByCuisine(cuisine),
      ]);

      const cuisineRecipeIds = new Set(
        cuisineRecipes.map((recipe) => recipe.idMeal),
      );

      const filteredRecipes = categoryRecipes.filter((recipe) =>
        cuisineRecipeIds.has(recipe.idMeal),
      );

      setRecipes(filteredRecipes);

      return;
    }

    if (category) {
      const recipes = await getMealsByCategory(category);

      setRecipes(recipes);

      return;
    }

    if (cuisine) {
      const recipes = await getMealsByCuisine(cuisine);

      setRecipes(recipes);

      return;
    }

    const featuredRecipes = await getMealsByCategory(DEFAULT_CATEGORY);

    setRecipes(featuredRecipes, true);
  } catch (error) {
    showErrorState(error);
  }
}

// search

async function handleSearch(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    return;
  }

  categoryFilter.value = "";
  cuisineFilter.value = "";

  showLoadingState();

  recipesSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  try {
    const recipes = await searchMealsByName(query);

    setRecipes(recipes);
  } catch (error) {
    showErrorState(error);
  }
}

// random

async function handleRandomRecipe() {
  searchInput.value = "";

  categoryFilter.value = "";
  cuisineFilter.value = "";

  showLoadingState();

  recipesSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  try {
    const recipe = await getRandomMeal();

    if (!recipe) {
      setRecipes([]);

      return;
    }

    setRecipes([recipe]);
  } catch (error) {
    showErrorState(error);
  }
}

// initialize app

async function init() {
  showLoadingState();

  try {
    const [categories, cuisines, recipes] = await Promise.all([
      getCategories(),
      getCuisines(),
      getMealsByCategory(DEFAULT_CATEGORY),
    ]);

    renderCategories(categoryFilter, categories);

    renderCuisines(cuisineFilter, cuisines);

    categoryFilter.value = DEFAULT_CATEGORY;

    setRecipes(recipes);
  } catch (error) {
    showErrorState(error);
  }
}

// events

searchForm.addEventListener("submit", handleSearch);

categoryFilter.addEventListener("change", handleFiltersChange);

cuisineFilter.addEventListener("change", handleFiltersChange);

randomRecipeButton.addEventListener("click", handleRandomRecipe);

loadMoreButton.addEventListener("click", handleLoadMore);

recipesGrid.addEventListener("click", handleFavoriteClick);

window.addEventListener("pageshow", (event) => {
  if (event.persisted && currentRecipes.length > 0) {
    updateRecipesView();
  }
});

init();
