const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

export async function getCategories() {
  const data = await fetchData("list.php?c=list");

  return data.meals ?? [];
}

export async function getCuisines() {
  const data = await fetchData("list.php?a=list");

  return data.meals ?? [];
}

export async function getMealsByCategory(category) {
  const data = await fetchData(`filter.php?c=${encodeURIComponent(category)}`);

  return data.meals ?? [];
}

export async function getMealsByCuisine(cuisine) {
  const data = await fetchData(`filter.php?a=${encodeURIComponent(cuisine)}`);

  return data.meals ?? [];
}

export async function searchMealsByName(query) {
  const data = await fetchData(`search.php?s=${encodeURIComponent(query)}`);

  return data.meals ?? [];
}

export async function getRandomMeal() {
  const data = await fetchData("random.php");

  return data.meals?.[0] ?? null;
}
