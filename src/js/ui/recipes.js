function createRecipeCard(recipe) {
  return `
    <article class="recipe-card">
      <div class="recipe-card__media">
        <a
          class="recipe-card__image-link"
          href="./recipe.html?id=${recipe.idMeal}"
          aria-label="View ${recipe.strMeal} recipe"
        >
          <img
            class="recipe-card__image"
            src="${recipe.strMealThumb}"
            alt="${recipe.strMeal}"
            loading="lazy"
          />
        </a>

        <button
          class="recipe-card__favorite"
          type="button"
          data-meal-id="${recipe.idMeal}"
          aria-label="Add ${recipe.strMeal} to favorites"
        >
          <span
            class="recipe-card__favorite-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>

      <div class="recipe-card__body">
        <h3 class="recipe-card__title">
          <a href="./recipe.html?id=${recipe.idMeal}">
            ${recipe.strMeal}
          </a>
        </h3>

        <a
          class="recipe-card__link"
          href="./recipe.html?id=${recipe.idMeal}"
        >
          View recipe
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `;
}

function createEmptyState() {
  return `
    <div class="recipes-empty">
      <span class="recipes-empty__icon" aria-hidden="true">✦</span>

      <h3 class="recipes-empty__title">
        No recipes found
      </h3>

      <p class="recipes-empty__text">
        Try changing your filters or search for something else.
      </p>
    </div>
  `;
}

export function renderRecipes(container, recipes) {
  if (recipes.length === 0) {
    container.innerHTML = createEmptyState();

    return;
  }

  const markup = recipes.map(createRecipeCard).join("");

  container.innerHTML = markup;
}

export function renderLoading(container) {
  const skeletons = Array.from(
    { length: 3 },
    () => `
      <div class="recipe-skeleton" aria-hidden="true">
        <div class="recipe-skeleton__image"></div>

        <div class="recipe-skeleton__line recipe-skeleton__line--title"></div>

        <div class="recipe-skeleton__line recipe-skeleton__line--link"></div>
      </div>
    `,
  ).join("");

  container.innerHTML = skeletons;
}

export function renderError(container) {
  container.innerHTML = `
    <div class="recipes-empty">
      <span class="recipes-empty__icon" aria-hidden="true">✦</span>

      <h3 class="recipes-empty__title">
        Something went wrong
      </h3>

      <p class="recipes-empty__text">
        We couldn't load the recipes. Please try again.
      </p>
    </div>
  `;
}
