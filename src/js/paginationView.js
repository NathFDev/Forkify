import View from "./view";
import icons from "../img/icons.svg";

class PaginationView extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerPagination(handler) {
    this._parentEl.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return

      const goTo = +btn.dataset.goto
      handler(goTo);
    })
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const totPage = Math.ceil(this._data.results.length / this._data.resultsPerPage)

    if (curPage === 1 && totPage > 1) {
      return `
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `
    }

    if (curPage === totPage && totPage > 1) {
      return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}g#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      `
    }

    if (curPage < totPage) {
      return `
      <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}g#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `
    }

    return "";
  }
}

export default new PaginationView();
