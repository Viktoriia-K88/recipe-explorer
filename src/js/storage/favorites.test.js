// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { getFavoriteIds, isFavorite, toggleFavorite } from "./favorites";

describe("favorites storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a recipe to favorites", () => {
    toggleFavorite("123");

    expect(getFavoriteIds()).toEqual(["123"]);
  });

  it("removes a recipe when toggled again", () => {
    toggleFavorite("123");
    toggleFavorite("123");

    expect(getFavoriteIds()).toEqual([]);
  });

  it("checks if a recipe is favorite", () => {
    expect(isFavorite("123")).toBe(false);

    toggleFavorite("123");

    expect(isFavorite("123")).toBe(true);
  });

  it("handles invalid localStorage data", () => {
    localStorage.setItem("recipe-explorer-favorites", "invalid-data");

    expect(getFavoriteIds()).toEqual([]);
  });
});
