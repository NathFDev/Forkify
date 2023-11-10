import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config";
import { getJSON, sendJSON } from "./helper";

function persistBookmark() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks))
}

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1
  },
  bookmarks: []
}

const init = function () {
  const bookmark = localStorage.getItem("bookmarks")
  if (bookmark) state.bookmarks = JSON.parse(bookmark)
}
init()

export async function loadRecipe(id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    state.recipe = data.data.recipe;

    if (state.bookmarks.some(i => i.id === id)) state.recipe.bookmarked = true
    else state.recipe.bookmarked = false
  } catch (error) {
    throw error
  }
}

export async function loadSearchResult(query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
    if (!data.results) throw new Error
    state.search.results = data.data.recipes.map(i => {
      return {
        id: i.id,
        title: i.title,
        publisher: i.publisher,
        image_url: i.image_url,
        ...(i.key && {key: i.key})
      }
    })
    state.search.page = 1
  } catch (err) {
    throw err
  }
}
  
export function getResultPerPage(page = state.search.page) { 
  state.search.page = page
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}  

export function updateServings(servings) {
  state.recipe.ingredients.forEach(i => {
    i.quantity = i.quantity * servings / state.recipe.servings
  });

  state.recipe.servings = servings
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe)

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

  persistBookmark()
}
 
export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(i => i.id === id);
  state.bookmarks.splice(index, 1)

  if (id === state.recipe.id) state.recipe.bookmarked = false

  persistBookmark()
}
  
export async function uploadRecipe(recipe) { 
  try {
    const ingredients = Object.entries(recipe)
    .filter(i => i[0].startsWith("ingredient") && i[1] !== "")
    .map(i => {
      const ingArr = i[1].split(",").map(i => i.trim());
      if (ingArr.length !== 3) throw new Error("Wrong ingredient format")
      const [quantity, unit, description] = ingArr;
      return {quantity: quantity ? +quantity : null, unit, description}
    })

    const recipes = {
      title: recipe.title,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      publisher: recipe.publisher,
      cooking_time: +recipe.cookingTime,
      servings: +recipe.servings,
      ingredients
    }

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipes)
    state.recipe = data.data.recipe
    addBookmark(state.recipe)
  } catch (error) {
    throw error
  }
}
 