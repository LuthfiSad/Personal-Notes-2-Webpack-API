class NoteList extends HTMLElement {
  _notesData = [];
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        margin-top: 30px;
        overflow-x: auto;
      }

      #noteContainer {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 50px;
      }

      #noteContainer > div {
        width: 100%;
      }

      #noteContainer > div > h5 {
        color: red;
      }
      
      #notes-archived {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }

      #notes-nonarchived {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
      }

      .note {
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 25px;
      }

      .note-title {
        font-weight: bold;
      }

      .note-body {
        margin-top: 10px;
        overflow: hidden;
        max-height: 200px;
        text-overflow: ellipsis;
      }

      .note-info {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
      }

      .action-buttons {
        display: flex;
        justify-content: end;
        gap: 2px;
        flex-wrap: wrap;
      }

      .action-buttons button {
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        color: white;
      }

      .action-buttons button:hover {
        opacity: 0.9;
      }

      .archive-button {
        background-color: green;
      }

      .unarchive-button {
        background-color: gray;
      }

      .delete-button {
        background-color: red;
      }

      .text-center {
        text-align: center;
      }

      .loading::before {
        content: "Loading";
        animation: loading 1s infinite steps(4);
        display: inline-block;
      }

      @keyframes loading {
        0% {
          content: "Loading";
        }
        25% {
          content: "Loading.";
        }
        50% {
          content: "Loading..";
        }
        75% {
          content: "Loading...";
        }
      }

      @media screen and (max-width: 600px) {
        #noteContainer {
          padding: 20px;
        }
      }
    `;

    const container = document.createElement("div");
    container.setAttribute("id", "noteContainer");

    shadow.appendChild(style);
    shadow.appendChild(container);

    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-button")) {
        if (confirm("Apakah data ini ingin di hapus")) {
          const noteId = event.target.getAttribute("data-id");
          this.deleteNote(noteId);
        }
      }
      if (event.target.classList.contains("unarchive-button")) {
        if (confirm("Apakah data ini ingin di unarchive")) {
          const noteId = event.target.getAttribute("data-id");
          this.unarchiveNote(noteId);
        }
      }
      if (event.target.classList.contains("archive-button")) {
        if (confirm("Apakah data ini ingin di archive")) {
          const noteId = event.target.getAttribute("data-id");
          this.archiveNote(noteId);
        }
      }
    });
  }

  connectedCallback() {
    this.getNonArchivedNotes();
    this.getArchivedNotes();
  }

  render() {
    this.innerHTML = "";

    if (this._notesData.length <= 0) {
      const container = this.shadowRoot.getElementById("noteContainer");
      container.innerHTML = `<h2 class="text-center">Data masih kosong...</h2>`;
    } else {
      this.setNotesData(this._notesData);
    }
  }

  async getNonArchivedNotes() {
    this.renderLoading();
    try {
      const response = await fetch("https://notes-api.dicoding.dev/v2/notes");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseContent = await response.json();
      this._notesData = [...this._notesData, ...responseContent.data];

      this.render();
    } catch (error) {
      console.error(`Error getting notes data: ${error}`);
      window.alert(`Error getting notes data: ${error}`);
    }
  }

  async getArchivedNotes() {
    try {
      this.renderLoading();

      const response = await fetch(
        "https://notes-api.dicoding.dev/v2/notes/archived"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseContent = await response.json();

      this._notesData = [...this._notesData, ...responseContent.data];

      this.render();
    } catch (error) {
      console.error(`Error getting notes data: ${error}`);
      window.alert(`Error getting archived notes data: ${error}`);
    }
  }

  async addNote(newNote) {
    try {
      this.renderLoading();

      const option = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      };

      const response = await fetch(
        "https://notes-api.dicoding.dev/v2/notes",
        option
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseContent = await response.json();
      this._notesData.push(await responseContent.data);

      this.render();
    } catch (error) {
      console.error(`Error uploading new data: ${error}`);
      window.alert(`Error uploading new data: ${error}`);
    }
  }

  async deleteNote(id) {
    try {
      this.renderLoading();

      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      this._notesData = this._notesData.filter((note) => note.id != id);
    } catch (error) {
      console.error(`Error deleting data: ${error}`);
      window.alert(`Error deleting data: ${error}`);
    }

    this.render();
  }

  async archiveNote(id) {
    try {
      this.renderLoading();

      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${id}/archive`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      this._notesData = this._notesData.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      );
    } catch (error) {
      console.error(`Error archiving data: ${error}`);
      window.alert(`Error archiving data: ${error}`);
    }

    this.render();
  }

  async unarchiveNote(id) {
    try {
      this.renderLoading();

      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      this._notesData = this._notesData.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      );
    } catch (error) {
      console.error(`Error unarchiving data: ${error}`);
      window.alert(`Error unarchiving data: ${error}`);
    }

    this.render();
  }

  renderLoading() {
    const container = this.shadowRoot.getElementById("noteContainer");
    container.innerHTML = `<h2 class="loading text-center"></h2>`;
  }

  sortedData(data) {
    return data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  setNotesData(data) {
    const container = this.shadowRoot.getElementById("noteContainer");
    container.innerHTML = "";

    const undifined = document.createElement("h5");
    undifined.textContent = "Data Kosong";

    const divNonArchived = document.createElement("div");
    const headerNonArchived = document.createElement("h3");
    headerNonArchived.textContent = "Notes Non-Archived";
    const nonArchived = document.createElement("div");
    nonArchived.setAttribute("id", "notes-nonarchived");
    divNonArchived.appendChild(headerNonArchived);
    if (data.some((item) => !item.archived)) {
      divNonArchived.appendChild(nonArchived);
    } else {
      divNonArchived.appendChild(undifined);
    }

    const divArchived = document.createElement("div");
    const headerArchived = document.createElement("h3");
    headerArchived.textContent = "Notes Archived";
    const archived = document.createElement("div");
    archived.setAttribute("id", "notes-archived");
    divArchived.appendChild(headerArchived);
    if (data.some((item) => item.archived)) {
      divArchived.appendChild(archived);
    } else {
      divArchived.appendChild(undifined);
    }

    container.appendChild(divNonArchived);
    container.appendChild(divArchived);

    this.sortedData(data).forEach((note) => {
      this.addNoteElement(note.archived ? archived : nonArchived, note);
    });
  }

  formatDate = (dateString) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${year}-${months[monthIndex]}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  addNoteElement(node, note) {
    const div = document.createElement("div");
    div.classList.add("note");
    div.innerHTML = `
      <div class="note-title">${note.title}</div>
      <div class="note-body">${note.body}</div>
      <div class="note-info">Created At: ${this.formatDate(
        note.createdAt
      )}<br>Archived: ${note.archived}</div>
      <div class="action-buttons">
        ${
          note.archived
            ? '<button class="unarchive-button" data-id="' +
              note.id +
              '">Unarchive</button>'
            : '<button class="archive-button" data-id="' +
              note.id +
              '">Archive</button>'
        }
        <button class="delete-button" data-id="${note.id}">Delete</button>
      </div>
    `;
    node.appendChild(div);
  }
}

customElements.define("note-list", NoteList);
