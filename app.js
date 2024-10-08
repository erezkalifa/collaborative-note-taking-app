import { auth } from "./firebase.js"; // Import auth from firebase.js
import { setupSignup, setupLogin, setupLogout } from "./auth.js";
// import { loadNotebooks, showNotebookEditor } from "./notebooks.js";
import { loadNotebooks } from "./notebooks.js";
// import {
//   loadNotebookNotes,
//   loadVersionHistory,
//   showNoteEditor,
//   saveNote,
// } from "./notes.js"; // Import the function

// Check if the user is authenticated
auth.onAuthStateChanged((user) => {
  if (user) {
    loadNotebooks();
    document.getElementById("notesContainer").style.display = "flex";
    document.getElementById("loginContainer").style.display = "none";
  } else {
    document.getElementById("notesContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
  }
});

// Initialize auth functions
setupSignup();
setupLogin();
setupLogout();
