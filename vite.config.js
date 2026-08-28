import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/recipe-explorer/",

  input: {
    main: resolve(import.meta.dirname, "index.html"),
    favorites: resolve(import.meta.dirname, "favorites.html"),
    recipe: resolve(import.meta.dirname, "recipe.html"),
  },
});
