function appendOptions(selectElement, items, valueKey) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const option = document.createElement("option");
    const value = item[valueKey] || "";

    option.value = value;
    option.textContent = value;

    fragment.append(option);
  });

  selectElement.append(fragment);
}

export function renderCategories(selectElement, categories) {
  appendOptions(selectElement, categories, "strCategory");
}

export function renderCuisines(selectElement, cuisines) {
  appendOptions(selectElement, cuisines, "strArea");
}
