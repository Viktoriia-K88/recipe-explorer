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

// DOM ELEMENTS

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#recipe-search");

const categoryFilter = document.querySelector("#category-filter");
const cuisineFilter = document.querySelector("#cuisine-filter");

const recipesSection = document.querySelector("#recipes");
const recipesGrid = document.querySelector("#recipes-grid");
const recipesCount = document.querySelector("#recipes-count");

const randomRecipeButton = document.querySelector("#random-recipe-button");
const loadMoreButton = document.querySelector("#load-more-button");

// CONSTANTS

const RECIPES_PER_PAGE = 9;
const DEFAULT_CATEGORY = "Seafood";

// STATE

let currentRecipes = [];
let visibleRecipesCount = RECIPES_PER_PAGE;
let isFeaturedView = false;

// LOADING STATE

function showLoadingState() {
  recipesCount.textContent = "";
  loadMoreButton.hidden = true;

  renderLoading(recipesGrid);
}

// ERROR STATE

function showErrorState(error) {
  currentRecipes = [];
  visibleRecipesCount = RECIPES_PER_PAGE;
  isFeaturedView = false;

  recipesCount.textContent = "";
  loadMoreButton.hidden = true;

  renderError(recipesGrid);

  console.error(error);
}

// RENDER CURRENT RECIPES

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

// SET NEW RECIPES

function setRecipes(recipes, featured = false) {
  currentRecipes = recipes;
  visibleRecipesCount = RECIPES_PER_PAGE;
  isFeaturedView = featured;

  updateRecipesView();
}

// LOAD MORE

function handleLoadMore() {
  visibleRecipesCount += RECIPES_PER_PAGE;

  updateRecipesView();
}

// FILTER RECIPES

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

// SEARCH RECIPES

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

// RANDOM RECIPE

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

// INITIALIZE APP

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

// EVENTS

searchForm.addEventListener("submit", handleSearch);

categoryFilter.addEventListener("change", handleFiltersChange);

cuisineFilter.addEventListener("change", handleFiltersChange);

randomRecipeButton.addEventListener("click", handleRandomRecipe);

loadMoreButton.addEventListener("click", handleLoadMore);

// START APP

init();
