import { isFavorite } from "../storage/favorites";

function getIngredients(recipe) {
  const ingredients = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = recipe[`strIngredient${i}`];

    const measure = recipe[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return ingredients;
}

export function renderRecipeDetails(container, recipe) {
  const ingredients = getIngredients(recipe);

  const cuisine = recipe.strArea || recipe.strCountry;

  const favorite = isFavorite(recipe.idMeal);

  const instructions =
    recipe.strInstructions?.trim() || "Instructions are not available.";

  container.replaceChildren();

  // back link

  const backLink = document.createElement("a");

  backLink.className = "recipe-details__back";

  backLink.href = "./index.html";

  const backArrow = document.createElement("span");

  backArrow.setAttribute("aria-hidden", "true");

  backArrow.textContent = "←";

  backLink.append(backArrow, document.createTextNode(" Back to recipes"));

  // hero

  const hero = document.createElement("div");

  hero.className = "recipe-details__hero";

  const media = document.createElement("div");

  media.className = "recipe-details__media";

  const image = document.createElement("img");

  image.className = "recipe-details__image";

  image.src = recipe.strMealThumb;
  image.alt = recipe.strMeal;

  media.append(image);

  // info

  const info = document.createElement("div");

  info.className = "recipe-details__info";

  const meta = document.createElement("p");

  meta.className = "recipe-details__meta";

  meta.textContent = cuisine
    ? `${recipe.strCategory} · ${cuisine}`
    : recipe.strCategory;

  const title = document.createElement("h1");

  title.className = "recipe-details__title";

  title.textContent = recipe.strMeal;

  const intro = document.createElement("p");

  intro.className = "recipe-details__intro";

  intro.textContent = "Everything you need to prepare this recipe at home.";

  // favorite button

  const favoriteButton = document.createElement("button");

  favoriteButton.className = "recipe-details__favorite";

  favoriteButton.type = "button";

  favoriteButton.dataset.mealId = recipe.idMeal;

  favoriteButton.setAttribute("aria-pressed", String(favorite));

  favoriteButton.setAttribute(
    "aria-label",
    favorite
      ? `Remove ${recipe.strMeal} from favorites`
      : `Add ${recipe.strMeal} to favorites`,
  );

  if (favorite) {
    favoriteButton.classList.add("is-favorite");
  }

  const favoriteIcon = document.createElement("span");

  favoriteIcon.className = "recipe-details__favorite-icon";

  favoriteIcon.setAttribute("aria-hidden", "true");

  const favoriteText = document.createElement("span");

  favoriteText.className = "recipe-details__favorite-text";

  favoriteText.textContent = favorite ? "Saved" : "Save recipe";

  favoriteButton.append(favoriteIcon, favoriteText);

  info.append(meta, title, intro, favoriteButton);

  hero.append(media, info);

  // body

  const body = document.createElement("div");

  body.className = "recipe-details__body";

  // ingredients

  const ingredientsSection = document.createElement("div");

  ingredientsSection.className = "recipe-details__ingredients";

  const ingredientsTitle = document.createElement("h2");

  ingredientsTitle.className = "recipe-details__heading";

  ingredientsTitle.textContent = "Ingredients";

  const ingredientsList = document.createElement("ul");

  ingredientsList.className = "recipe-details__ingredients-list";

  ingredients.forEach(({ ingredient, measure }) => {
    const item = document.createElement("li");

    item.className = "recipe-details__ingredient";

    const ingredientName = document.createElement("span");

    ingredientName.textContent = ingredient;

    const ingredientMeasure = document.createElement("span");

    ingredientMeasure.textContent = measure;

    item.append(ingredientName, ingredientMeasure);

    ingredientsList.append(item);
  });

  ingredientsSection.append(ingredientsTitle, ingredientsList);

  // instructions

  const instructionsSection = document.createElement("div");

  instructionsSection.className = "recipe-details__instructions";

  const instructionsTitle = document.createElement("h2");

  instructionsTitle.className = "recipe-details__heading";

  instructionsTitle.textContent = "Instructions";

  const instructionsText = document.createElement("p");

  instructionsText.className = "recipe-details__instructions-text";

  instructionsText.textContent = instructions;

  instructionsSection.append(instructionsTitle, instructionsText);

  body.append(ingredientsSection, instructionsSection);

  container.append(backLink, hero, body);
}
