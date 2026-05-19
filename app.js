showNotes();

// =========================
// SHOW NOTES
// =========================

async function showNotes() {
  const data = await sql("SELECT * FROM notes");

  const container = document.getElementById("notes");

  if (!container) return;

  container.innerHTML = "";

  data.forEach((note) => {
    const article = document.createElement("article");

    // NAME
    const name = document.createElement("h2");
    name.innerText = note.name;

    article.appendChild(name);

    // MENU
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.innerText = "⋯";

    // DROPDOWN
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    // READ
    const readButton = document.createElement("button");
    readButton.innerText = "Read";
    readButton.className = "read";

    readButton.addEventListener("click", () => {
      window.location.href = "read.html?id=" + note.id;
    });

    // UPDATE
    const updateButton = document.createElement("button");
    updateButton.innerText = "Update";
    updateButton.className = "update";

    updateButton.addEventListener("click", () => {
      window.location.href = "editor.html?id=" + note.id;
    });

    // DELETE
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    deleteButton.addEventListener("click", () => {
      confirmDelete(note.id, article);
    });

    dropdown.appendChild(readButton);
    dropdown.appendChild(updateButton);
    dropdown.appendChild(deleteButton);

    menu.appendChild(dropdown);

    article.appendChild(menu);

    container.appendChild(article);
  });
}

// =========================
// CREATE
// =========================

function createNote() {
  window.location.href = "editor.html";
}

// =========================
// SAVE
// =========================

async function saveNote() {
  const id = new URLSearchParams(window.location.search).get("id");

  const name = document.getElementById("name").value;

  const text = document.getElementById("text").innerHTML;

  // UPDATE
  if (id) {
    await sql(`
      UPDATE notes
      SET name = '${name}',
      text = '${text}'
      WHERE id = ${id}
    `);
  }

  // CREATE
  else {
    await sql(`
      INSERT INTO notes (name, text)
      VALUES ('${name}', '${text}')
    `);
  }

  window.location.href = "index.html";
}

// =========================
// LOAD NOTE
// =========================

async function loadNote() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) return;

  const data = await sql(`
    SELECT * FROM notes
    WHERE id = ${id}
  `);

  document.getElementById("name").value = data[0].name;

  document.getElementById("text").innerHTML = data[0].text;
}

// =========================
// READ NOTE
// =========================

async function loadReadNote() {
  const id = new URLSearchParams(window.location.search).get("id");

  const data = await sql(`
    SELECT * FROM notes
    WHERE id = ${id}
  `);

  document.getElementById("readName").innerText = data[0].name;

  document.getElementById("readText").innerHTML = data[0].text;
}

// =========================
// DELETE
// =========================

function confirmDelete(id, element) {
  const confirmBox = document.createElement("div");

  confirmBox.className = "confirmBox";

  const text = document.createElement("p");

  text.innerText = "Opravdu chcete poznámku smazat?";

  const buttons = document.createElement("div");

  buttons.className = "confirmButtons";

  // YES
  const yes = document.createElement("button");

  yes.className = "yes";
  yes.innerText = "Ano";

  yes.addEventListener("click", async () => {
    await sql(`
      DELETE FROM notes
      WHERE id = ${id}
    `);

    element.remove();

    confirmBox.remove();
  });

  // NO
  const no = document.createElement("button");

  no.className = "no";
  no.innerText = "Ne";

  no.addEventListener("click", () => {
    confirmBox.remove();
  });

  buttons.appendChild(yes);
  buttons.appendChild(no);

  confirmBox.appendChild(text);
  confirmBox.appendChild(buttons);

  document.body.appendChild(confirmBox);
}

// =========================
// TOOLBAR
// =========================

function formatText(command) {
  document.execCommand(command);
}

function alignText(position) {
  if (position === "left") {
    document.execCommand("justifyLeft");
  }

  if (position === "center") {
    document.execCommand("justifyCenter");
  }

  if (position === "right") {
    document.execCommand("justifyRight");
  }
}
