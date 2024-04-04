class InputTitle extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: flex;
        justify-content: center; 
      }

      div {
        max-width: 600px;
        margin-inline: 10px;
        width: 100%;
      }

      label {
        display: block;
        font-size: 18px;
        font-weight: 600;
        margin-top: 10px;
      }

      input, textarea {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      
      textarea {
        height: 10rem;
        resize: none;
      }
    `;

    this.div = document.createElement('div');

    this.labelInput = document.createElement('label');
    this.labelInput.setAttribute('for', 'judul');
    this.labelInput.textContent = "Judul :";

    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('id', 'judul');
    this.inputElement.setAttribute('type', 'text');
    this.inputElement.setAttribute('placeholder', 'Judul');
    this.inputElement.addEventListener('input', this.handleInput.bind(this));

    this.labelTextarea = document.createElement('label');
    this.labelTextarea.setAttribute('for', 'body');
    this.labelTextarea.textContent = "Isi :";

    this.textAreaElement = document.createElement('textarea');
    this.textAreaElement.setAttribute('id', 'body');
    this.textAreaElement.setAttribute('placeholder', 'Masukan Isi Notes');
    this.textAreaElement.addEventListener('input', this.handleInput.bind(this));

    this.div.appendChild(this.labelInput);
    this.div.appendChild(this.inputElement);
    this.div.appendChild(this.labelTextarea);
    this.div.appendChild(this.textAreaElement);
    shadow.appendChild(style);
    shadow.appendChild(this.div)
  }

  handleInput(event) {
    if (typeof this.callback === 'function') {
      this.callback(this.inputElement.value, this.textAreaElement.value);
    }
  }

  setCallback(callback) {
    this.callback = callback;
  }

  render(inputValue, textAreaValue) {
    this.inputElement.value = inputValue;
    this.textAreaElement.value = textAreaValue;
  }
}

customElements.define('custom-input', InputTitle);
