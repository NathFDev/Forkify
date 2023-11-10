import "core-js";
import "regenerator-runtime/runtime";
import * as model from "./model";
import recipeView from "./recipeView";
import searchView from "./searchView";
import resultsView from "./resultsView";
import paginationView from "./paginationView";
import bookmarkView from "./bookmarkView";
import addRecipeView from "./addRecipeView";

function init() {
	recipeView.addHandlerRender(controlRecipe)
	recipeView.addHandlerUpdateServings(controlServings)
	recipeView.addHandlerBookmark(controlBookmark)
	searchView.addHandlerSearch(controlSearchResults)
	paginationView.addHandlerPagination(controlPagination)
	bookmarkView.addHandlerRender(controlBookmarkRender)
	addRecipeView.addHandlerUpload(controlUploadRecipe)
}
  
init();

async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    
    // Show spinner
		recipeView.renderSpinner();
		
		//Update page when result is selected
		resultsView.update(model.getResultPerPage())
		bookmarkView.update(model.state.bookmarks)

		// Fetch recipes
		await model.loadRecipe(id)

		// Load recipes
		recipeView.render(model.state.recipe)

	} catch (err) {
		recipeView.renderError();
	}
}

async function controlSearchResults() {
	try {
		// Render loading spinner 
		resultsView.renderSpinner();

		// Get query from search bar
		const query = searchView.getQuery();
		if (!query) return

		// Fetch data from search
		await model.loadSearchResult(query);

		// Render data 
		resultsView.render(model.getResultPerPage());

		// Render pagination button
		paginationView.render(model.state.search)
	} catch (err) {
		resultsView.renderError();
	}
}
	
function controlPagination(goto) {
	// Render data 
	resultsView.render(model.getResultPerPage(goto));

	// Render pagination button
	paginationView.render(model.state.search)
}

function controlServings(servings) {
	// Update servings count
	model.updateServings(servings)

	//Update recipe
	recipeView.update(model.state.recipe)
}
	
function controlBookmark() {
	// Save or delete bookmark
	if (!model.state.recipe.bookmarked) {
		model.addBookmark(model.state.recipe)
	} else {
		model.deleteBookmark(model.state.recipe.id)
	}

	// Update UI
	recipeView.update(model.state.recipe)

	// Render bookmark
	bookmarkView.render(model.state.bookmarks)
}
	
function controlBookmarkRender() {
	bookmarkView.render(model.state.bookmarks)
}

async function controlUploadRecipe(recipe) {
	try {
		addRecipeView.renderSpinner()

		await model.uploadRecipe(recipe)

		recipeView.render(model.state.recipe)

		bookmarkView.render(model.state.bookmarks)

		addRecipeView.toggleWindow()

		window.history.pushState(null, "", `#${model.state.recipe.id}`)
	} catch (error) {
		console.log(error)
	}
}
	