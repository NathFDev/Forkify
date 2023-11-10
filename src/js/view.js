import icons from "../img/icons.svg";

class View {
  _data;
  _errMessage =
    "Oops! We couldn't find the recipe you're looking for. It might have been whisked away by a mischievous ingredient. Please check the recipe name and try again";

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(markup);
    const newEl = Array.from(newDOM.querySelectorAll("*"));
    const curEl = Array.from(this._parentEl.querySelectorAll("*"));

    newEl.forEach((el, i) => {
      const oldEl = curEl[i];

      if (!el.isEqualNode(oldEl) && el.firstChild?.nodeValue.trim())
        oldEl.textContent = el.textContent;

      if (!el.isEqualNode(oldEl))
        Array.from(el.attributes).forEach((i) =>
          oldEl.setAttribute(i.name, i.value),
        );
    });
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(err = this._errMessage) {
    const markup = `
    <div class="message">
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${err}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentEl.innerHTML = "";
  }
}

export default View;

