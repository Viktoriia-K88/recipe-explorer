import { isFavorite } from "../storage/favorites";

function createRecipeCard(recipe) {
  const favorite = isFavorite(recipe.idMeal);
  const recipeUrl = `./recipe.html?id=${encodeURIComponent(recipe.idMeal)}`;

  const card = document.createElement("article");
  card.className = "recipe-card";

  const media = document.createElement("div");
  media.className = "recipe-card__media";

  const imageLink = document.createElement("a");
  imageLink.className = "recipe-card__image-link";
  imageLink.href = recipeUrl;
  imageLink.setAttribute("aria-label", `View ${recipe.strMeal} recipe`);

  const image = document.createElement("img");
  image.className = "recipe-card__image";
  image.src = recipe.strMealThumb;
  image.alt = recipe.strMeal;
  image.loading = "lazy";

  imageLink.append(image);

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "recipe-card__favorite";
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
  favoriteIcon.className = "recipe-card__favorite-icon";
  favoriteIcon.setAttribute("aria-hidden", "true");

  favoriteButton.append(favoriteIcon);

  media.append(imageLink, favoriteButton);

  const body = document.createElement("div");
  body.className = "recipe-card__body";

  const title = document.createElement("h3");
  title.className = "recipe-card__title";

  const titleLink = document.createElement("a");
  titleLink.href = recipeUrl;
  titleLink.textContent = recipe.strMeal;

  title.append(titleLink);

  const viewLink = document.createElement("a");
  viewLink.className = "recipe-card__link";
  viewLink.href = recipeUrl;

  viewLink.append(document.createTextNode("View recipe "));

  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  viewLink.append(arrow);

  body.append(title, viewLink);

  card.append(media, body);

  return card;
}

function createStatus(titleText, descriptionText) {
  const status = document.createElement("div");
  status.className = "recipes-empty";

  const icon = document.createElement("span");
  icon.className = "recipes-empty__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "✦";

  const title = document.createElement("h3");
  title.className = "recipes-empty__title";
  title.textContent = titleText;

  const text = document.createElement("p");
  text.className = "recipes-empty__text";
  text.textContent = descriptionText;

  status.append(icon, title, text);

  return status;
}

export function renderRecipes(container, recipes) {
  container.replaceChildren();

  if (recipes.length === 0) {
    container.append(
      createStatus(
        "No recipes found",
        "Try changing your filters or search for something else.",
      ),
    );

    return;
  }

  const fragment = document.createDocumentFragment();

  recipes.forEach((recipe) => {
    fragment.append(createRecipeCard(recipe));
  });

  container.append(fragment);
}

export function renderLoading(container) {
  container.replaceChildren();

  const loadingText = document.createElement("p");
  loadingText.className = "visually-hidden";
  loadingText.textContent = "Loading recipes...";

  const fragment = document.createDocumentFragment();

  fragment.append(loadingText);

  for (let i = 0; i < 3; i += 1) {
    const skeleton = document.createElement("div");

    skeleton.className = "recipe-skeleton";
    skeleton.setAttribute("aria-hidden", "true");

    const image = document.createElement("div");

    image.className = "recipe-skeleton__image";

    const titleLine = document.createElement("div");

    titleLine.className = "recipe-skeleton__line recipe-skeleton__line--title";

    const linkLine = document.createElement("div");

    linkLine.className = "recipe-skeleton__line recipe-skeleton__line--link";

    skeleton.append(image, titleLine, linkLine);

    fragment.append(skeleton);
  }

  container.append(fragment);
}

export function renderError(container) {
  container.replaceChildren(
    createStatus(
      "Something went wrong",
      "We couldn't load the recipes. Please try again.",
    ),
  );
}
