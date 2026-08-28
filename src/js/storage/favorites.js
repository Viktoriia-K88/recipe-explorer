const FAVORITES_KEY = "recipe-explorer-favorites";

export function getFavoriteIds() {
  const savedFavorites = localStorage.getItem(FAVORITES_KEY);

  if (!savedFavorites) {
    return [];
  }

  try {
    const favoriteIds = JSON.parse(savedFavorites);

    if (!Array.isArray(favoriteIds)) {
      return [];
    }

    return favoriteIds.map(String);
  } catch {
    return [];
  }
}

function saveFavoriteIds(favoriteIds) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
}

export function isFavorite(id) {
  return getFavoriteIds().includes(String(id));
}

export function toggleFavorite(id) {
  const recipeId = String(id);

  const favoriteIds = getFavoriteIds();

  const alreadyFavorite = favoriteIds.includes(recipeId);

  const updatedFavorites = alreadyFavorite
    ? favoriteIds.filter((favoriteId) => favoriteId !== recipeId)
    : [...favoriteIds, recipeId];

  saveFavoriteIds(updatedFavorites);

  return !alreadyFavorite;
}
