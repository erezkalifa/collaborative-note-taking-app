import { db } from "./firebase.js";
import { auth } from "./firebase.js"; // Import the auth object where needed
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

export function loadNotebookNotes(notebookId) {
  const notesList = document.getElementById("notesList");

  const notesQuery = query(
    collection(db, `notebooks/${notebookId}/notes`),
    orderBy("createdAt")
  );

  onSnapshot(notesQuery, (snapshot) => {
    notesList.innerHTML = ""; // Clear the list

    snapshot.forEach((doc) => {
      const note = doc.data();
      const li = document.createElement("li");
      li.textContent = note.title;

      // Add click event to load the note's content into the note editor
      li.addEventListener("click", () => {
        showNoteEditor(doc.id, notebookId, note); // This function should show the note editor
      });

      notesList.appendChild(li); // Append each note to the list
    });
  });
}

export async function saveNote() {
  const noteTitle = document.getElementById("noteTitle").value;
  const noteContent = document.getElementById("noteContent").value;
  const userId = auth.currentUser.uid;
  const notebookId = document
    .getElementById("saveNoteBtn")
    .getAttribute("data-notebook-id");
  const noteId = document
    .getElementById("saveNoteBtn")
    .getAttribute("data-note-id");

  if (noteId) {
    const noteRef = doc(db, `notebooks/${notebookId}/notes`, noteId);
    await updateDoc(noteRef, { title: noteTitle, content: noteContent });
  } else {
    await addDoc(collection(db, `notebooks/${notebookId}/notes`), {
      userId,
      title: noteTitle,
      content: noteContent,
      createdAt: serverTimestamp(),
    });
  }

  document.getElementById("noteEditor").style.display = "none";
  loadNotebookNotes(notebookId);
}

// notes.js

export function showNoteEditor(noteId, notebookId, noteData) {
  const noteEditor = document.getElementById("noteEditor");

  // Show the note editor and hide other editors (like the notebook editor)
  noteEditor.style.display = "block";
  document.getElementById("notebookEditor").style.display = "none"; // Hide notebook editor if open

  // Set the note title and content in the note editor
  document.getElementById("noteTitle").value = noteData.title;
  document.getElementById("noteContent").value = noteData.content;

  // Store note ID and notebook ID in the save and delete buttons
  document.getElementById("saveNoteBtn").setAttribute("data-note-id", noteId);
  document
    .getElementById("saveNoteBtn")
    .setAttribute("data-notebook-id", notebookId);
  document.getElementById("deleteNoteBtn").setAttribute("data-note-id", noteId);
  document
    .getElementById("deleteNoteBtn")
    .setAttribute("data-notebook-id", notebookId);

  console.log(`Note editor opened for: ${noteData.title}`);
}

const saveNoteBtn = document.getElementById("saveNoteBtn");

saveNoteBtn.addEventListener("click", async () => {
  try {
    const noteTitle = document.getElementById("noteTitle").value;
    const noteContent = document.getElementById("noteContent").value;
    const userId = auth.currentUser.uid;

    const notebookId = document
      .getElementById("saveNoteBtn")
      .getAttribute("data-notebook-id");
    const noteId = document
      .getElementById("saveNoteBtn")
      .getAttribute("data-note-id");

    if (!notebookId) {
      console.error("No notebook selected.");
      return;
    }

    if (noteId) {
      // Update existing note
      const noteRef = doc(db, `notebooks/${notebookId}/notes`, noteId);
      const noteSnap = await getDoc(noteRef);
      const previousData = noteSnap.data();

      if (previousData) {
        // Save the current version before updating
        console.log("Saving version of current note:", previousData);
        await saveNoteVersion(noteId, notebookId, previousData);
      }

      await updateDoc(noteRef, {
        title: noteTitle,
        content: noteContent,
        updatedAt: serverTimestamp(),
      });
      console.log("Note updated and version saved.");
    } else {
      // Create a new note
      await addDoc(collection(db, `notebooks/${notebookId}/notes`), {
        userId: userId,
        title: noteTitle,
        content: noteContent,
        createdAt: serverTimestamp(),
      });
      console.log("New note created");
    }

    document.getElementById("noteEditor").style.display = "none"; // Hide note editor
    loadNotebookNotes(notebookId); // Reload the notes after saving/updating
  } catch (err) {
    console.error("Error adding/updating document:", err);
  }
});

const deleteNoteBtn = document.getElementById("deleteNoteBtn");

deleteNoteBtn.addEventListener("click", async () => {
  const noteId = deleteNoteBtn.getAttribute("data-note-id");
  const notebookId = deleteNoteBtn.getAttribute("data-notebook-id");

  if (noteId && notebookId) {
    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      const noteRef = doc(db, `notebooks/${notebookId}/notes`, noteId);
      await deleteDoc(noteRef);
      console.log("Note deleted");

      document.getElementById("noteEditor").style.display = "none"; // Hide editor after deletion
      loadNotebookNotes(notebookId); // Reload the notes
    }
  } else {
    console.error("No note selected for deletion.");
  }
});

const cancelEditBtn = document.getElementById("cancelEditBtn");

cancelEditBtn.addEventListener("click", () => {
  // Hide the note editor
  document.getElementById("noteEditor").style.display = "none";

  // Hide the version history panel if it's open
  const versionHistory = document.getElementById("versionHistory");
  if (versionHistory.style.display === "block") {
    versionHistory.style.display = "none";
  }

  console.log("Note editor and version history closed.");
});

const viewVersionHistoryBtn = document.getElementById("viewVersionHistoryBtn");

viewVersionHistoryBtn.addEventListener("click", () => {
  const noteId = saveNoteBtn.getAttribute("data-note-id"); // Get current note ID
  const notebookId = saveNoteBtn.getAttribute("data-notebook-id"); // Get current notebook ID

  if (noteId && notebookId) {
    document.getElementById("versionHistory").style.display = "block"; // Show version history section
    loadVersionHistory(noteId, notebookId); // Load the version history for the note
  } else {
    console.error("No note or notebook selected for version history.");
  }
});

export function loadVersionHistory(noteId, notebookId) {
  const versionsList = document.getElementById("versionsList");

  const versionsQuery = query(
    collection(db, `notebooks/${notebookId}/notes/${noteId}/versions`),
    orderBy("savedAt", "desc") // Show the most recent versions first
  );

  onSnapshot(versionsQuery, (snapshot) => {
    versionsList.innerHTML = ""; // Clear the list

    snapshot.forEach((doc) => {
      const version = doc.data();
      const li = document.createElement("li");
      li.textContent = `Version saved at ${new Date(
        version.savedAt.seconds * 1000
      ).toLocaleString()}`;

      // Add a button to revert to this version
      const revertButton = document.createElement("button");
      revertButton.textContent = "Revert to this version";
      revertButton.addEventListener("click", () => {
        revertToVersion(noteId, notebookId, doc.id); // Revert to this version
      });

      li.appendChild(revertButton);
      versionsList.appendChild(li);
    });
  });
}

const newNoteBtn = document.getElementById("newNoteBtn");

newNoteBtn.addEventListener("click", () => {
  const selectedNotebookId = document
    .getElementById("saveNoteBtn")
    .getAttribute("data-notebook-id");

  if (!selectedNotebookId) {
    console.error("No notebook selected. Please select a notebook first.");
    return;
  }

  // Clear the editor fields for a new note
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").value = "";

  // Clear any stored note ID since this is a new note
  document.getElementById("saveNoteBtn").removeAttribute("data-note-id");
  document.getElementById("deleteNoteBtn").removeAttribute("data-note-id");

  // Open the note editor and hide the notebook editor if open
  document.getElementById("noteEditor").style.display = "block";
  document.getElementById("notebookEditor").style.display = "none"; // Hide the notebook editor
});

export async function revertToVersion(noteId, notebookId, versionId) {
  try {
    const versionRef = doc(
      db,
      `notebooks/${notebookId}/notes/${noteId}/versions`,
      versionId
    );
    const versionSnap = await getDoc(versionRef);
    const versionData = versionSnap.data();

    // Revert the note to the selected version
    const noteRef = doc(db, `notebooks/${notebookId}/notes`, noteId);
    await updateDoc(noteRef, {
      title: versionData.title,
      content: versionData.content,
      updatedAt: serverTimestamp(),
    });

    console.log("Note reverted to previous version.");
    loadNotebookNotes(notebookId); // Reload the notes after reverting
  } catch (err) {
    console.error("Error reverting to version:", err);
  }
}

export async function saveNoteVersion(noteId, notebookId, previousData) {
  console.log("Saving version for note:", noteId); // Debug log

  const versionsRef = collection(
    db,
    `notebooks/${notebookId}/notes/${noteId}/versions`
  );

  try {
    await addDoc(versionsRef, {
      title: previousData.title,
      content: previousData.content,
      timestamp: previousData.updatedAt || previousData.createdAt, // Store the previous timestamp
      savedAt: serverTimestamp(), // Add the current timestamp for when the version was saved
    });

    console.log("Version saved successfully!");
  } catch (error) {
    console.error("Error saving version:", error); // Log any error
  }
}
