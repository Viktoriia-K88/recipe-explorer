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

  const ingredientsMarkup = ingredients
    .map(
      ({ ingredient, measure }) => `
        <li class="recipe-details__ingredient">
          <span>${ingredient}</span>
          <span>${measure}</span>
        </li>
      `,
    )
    .join("");

  const cuisine = recipe.strArea || recipe.strCountry;

  container.innerHTML = `
    <a class="recipe-details__back" href="./index.html">
      <span aria-hidden="true">←</span>
      Back to recipes
    </a>

    <div class="recipe-details__hero">
      <div class="recipe-details__media">
        <img
          class="recipe-details__image"
          src="${recipe.strMealThumb}"
          alt="${recipe.strMeal}"
        />
      </div>

      <div class="recipe-details__info">
        <p class="recipe-details__meta">
          ${recipe.strCategory}
          ${cuisine ? ` · ${cuisine}` : ""}
        </p>

        <h1 class="recipe-details__title">
          ${recipe.strMeal}
        </h1>

        <p class="recipe-details__intro">
          Everything you need to prepare this recipe at home.
        </p>
      </div>
    </div>

    <div class="recipe-details__body">
      <div class="recipe-details__ingredients">
        <h2 class="recipe-details__heading">
          Ingredients
        </h2>

        <ul class="recipe-details__ingredients-list">
          ${ingredientsMarkup}
        </ul>
      </div>

      <div class="recipe-details__instructions">
        <h2 class="recipe-details__heading">
          Instructions
        </h2>

        <p class="recipe-details__instructions-text">
          ${recipe.strInstructions}
        </p>
      </div>
    </div>
  `;
}
