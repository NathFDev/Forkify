import View from "./view";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload")

  constructor() {
    super()
    this._addHandlerOpen()
    this._addHandlerClose()
  }

  _window = document.querySelector(".add-recipe-window")
  _overlay = document.querySelector(".overlay")
  _btnOpen = document.querySelector(".nav__btn--add-recipe")
  _btnClose = document.querySelector(".btn--close-modal")

  toggleWindow() {
    this._overlay.classList.toggle("hidden")
    this._window.classList.toggle("hidden")
  }

  _addHandlerOpen() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this))
  }

  _addHandlerClose() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this))
    this._overlay.addEventListener("click", this.toggleWindow.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault()
      const data = Object.fromEntries([...new FormData(this)])
      handler(data)
    })
  }
}

export default new AddRecipeView();