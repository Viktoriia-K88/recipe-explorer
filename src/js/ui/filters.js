export function renderCategories(selectElement, categories) {
  const options = categories
    .map(
      (category) =>
        `<option value="${category.strCategory}">${category.strCategory}</option>`,
    )
    .join("");

  selectElement.insertAdjacentHTML("beforeend", options);
}

export function renderCuisines(selectElement, cuisines) {
  const options = cuisines
    .map(
      (cuisine) =>
        `<option value="${cuisine.strArea}">${cuisine.strArea}</option>`,
    )
    .join("");

  selectElement.insertAdjacentHTML("beforeend", options);
}
