import View from "./view";
import icons from "../img/icons.svg";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");

  _generateMarkup() {
    return this._data.map(i => this._generateMarkupPreview(i)).join("");
  }

  _generateMarkupPreview(i) {
    const id = window.location.hash.slice(1)

    return `
      <li class="preview">
        <a class="preview__link ${id === i.id ? "preview__link--active" : ""}" href="#${i.id}">
          <figure class="preview__fig">
            <img src=${i.image_url} alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${i.title}</h4>
            <p class="preview__publisher">${i.publisher}</p>
            <div class="preview__user-generated ${this._data.key ? "" : "hidden"}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `
  }
}

export default new ResultsView();