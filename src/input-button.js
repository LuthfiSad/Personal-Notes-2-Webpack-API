class CustomButton extends HTMLElement {
  static observedAttributes = ["color"];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this._color = this.getAttribute("color");
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        justify-content: center;
      }

      div {
        margin-top: 10px;
        margin-inline: 10px;
        max-width: 600px;
        width: 100%;
      }
      
      button {
        box-sizing: border-box;
        border-radius: 5px;
        width: 100%;
        padding-block: .5rem;
        border: none;
        color: white;
        cursor: pointer;
      }
    `;

    const div = document.createElement("div");

    const button = document.createElement("button");
    button.setAttribute('id', 'button');
    button.textContent = "Submit";
    div.appendChild(button);
    shadow.appendChild(style);
    shadow.appendChild(div);

    button.addEventListener("click", () => {
      const inputElement = document
        .querySelector("custom-input")
        .shadowRoot.querySelector("input");
      const textAreaElement = document
        .querySelector("custom-input")
        .shadowRoot.querySelector("textarea");
      if (inputElement.value && textAreaElement.value) {
        const title = inputElement.value;
        const body = textAreaElement.value;
        const noteList = document.querySelector("note-list");
        if (noteList) {
          noteList.addNote({ title, body });
        }
        inputElement.value = "";
        textAreaElement.value = "";
        alert('berhasil menambah catatan baru');
      } else {
        alert('tidak boleh ada kolom yang kosong');
      }
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "color" && oldValue !== newValue) {
      this._color = newValue;
      this.shadowRoot.querySelector("button").style.backgroundColor =
        this._color || "gray";
    }
  }

  get color() {
    return this.getAttribute("color");
  }

  set color(value) {
    this.setAttribute("color", value);
  }
}

customElements.define("custom-button", CustomButton);
