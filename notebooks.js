import { db } from "./firebase.js";
import { auth } from "./firebase.js"; // Import the auth object where needed
import {
  loadNotebookNotes,
  loadVersionHistory,
  showNoteEditor,
  saveNote,
  revertToVersion,
} from "./notes.js"; // Import the function
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

export function loadNotebooks() {
  const notebookList = document.getElementById("notebookList");
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (!userId) {
    console.error("No user logged in.");
    return;
  }

  const notebooksQuery = query(
    collection(db, "notebooks"),
    where("userId", "==", userId)
  );

  onSnapshot(notebooksQuery, (snapshot) => {
    notebookList.innerHTML = ""; // Clear the list

    snapshot.forEach((doc) => {
      const notebook = doc.data();
      const li = document.createElement("li");
      li.textContent = notebook.title;

      // Add click event to load the notebook's editor and its notes
      li.addEventListener("click", () => {
        // Show notebook editor and hide note editor
        document.getElementById("notebookEditor").style.display = "block";
        document.getElementById("noteEditor").style.display = "none"; // Hide note editor

        // Set notebook title in the notebook editor
        document.getElementById("notebookTitle").value = notebook.title;

        // Store notebook ID for updating/deleting
        document
          .getElementById("saveNotebookBtn")
          .setAttribute("data-notebook-id", doc.id);
        document
          .getElementById("deleteNotebookBtn")
          .setAttribute("data-notebook-id", doc.id);

        // Store the selected notebook ID for adding notes
        document
          .getElementById("saveNoteBtn")
          .setAttribute("data-notebook-id", doc.id); // <-- This is key

        console.log(`Notebook "${notebook.title}" selected for editing.`);

        // Load notes for the selected notebook
        loadNotebookNotes(doc.id);
      });

      notebookList.appendChild(li); // Append to the notebook list
    });
  });
}

export function showNotebookEditor(notebookId, notebookData) {
  const notebookEditor = document.getElementById("notebookEditor");

  // Show the notebook editor and hide note editor
  notebookEditor.style.display = "block";
  document.getElementById("noteEditor").style.display = "none"; // Hide note editor

  // Set the notebook title in the notebook editor
  const notebookTitleInput = document.getElementById("notebookTitle");
  notebookTitleInput.value = notebookData.title;

  // Store the notebook ID in the save and delete buttons
  document
    .getElementById("saveNotebookBtn")
    .setAttribute("data-notebook-id", notebookId);
  document
    .getElementById("deleteNotebookBtn")
    .setAttribute("data-notebook-id", notebookId);
}

document.getElementById("newNotebookBtn").addEventListener("click", () => {
  // Clear any previous notebook title
  document.getElementById("notebookTitle").value = "";

  // Open the notebook editor panel
  document.getElementById("notebookEditor").style.display = "block";

  // Remove any previously stored notebook ID (since we're creating a new one)
  document
    .getElementById("saveNotebookBtn")
    .removeAttribute("data-notebook-id");
});
document
  .getElementById("saveNotebookBtn")
  .addEventListener("click", async () => {
    const notebookTitle = document.getElementById("notebookTitle").value;
    const notebookId = document
      .getElementById("saveNotebookBtn")
      .getAttribute("data-notebook-id"); // Get the notebook ID if editing

    if (notebookTitle) {
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (!userId) {
        console.error("No user logged in.");
        return;
      }

      try {
        if (notebookId) {
          // If a notebook ID exists, update the existing notebook
          const notebookRef = doc(db, "notebooks", notebookId);
          await updateDoc(notebookRef, {
            title: notebookTitle,
          });
          console.log("Notebook updated successfully");
        } else {
          // If no notebook ID, create a new notebook
          await addDoc(collection(db, "notebooks"), {
            userId: userId,
            title: notebookTitle,
            createdAt: serverTimestamp(),
          });
          console.log("Notebook created successfully");
        }

        // Reload the list of notebooks after creation or update
        loadNotebooks();

        // Hide the notebook editor panel after saving
        document.getElementById("notebookEditor").style.display = "none";
      } catch (error) {
        console.error("Error saving notebook:", error);
      }
    } else {
      console.log("No notebook title entered.");
    }
  });

document
  .getElementById("cancelNotebookEditBtn")
  .addEventListener("click", () => {
    // Hide the notebook editor panel
    document.getElementById("notebookEditor").style.display = "none";
  });

const deleteNotebookBtn = document.getElementById("deleteNotebookBtn");
deleteNotebookBtn.addEventListener("click", async () => {
  const notebookId = deleteNotebookBtn.getAttribute("data-notebook-id");

  if (notebookId) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this notebook? All notes inside it will be deleted."
    );
    if (confirmDelete) {
      const notebookRef = doc(db, "notebooks", notebookId);
      await deleteDoc(notebookRef);
      console.log("Notebook deleted successfully");

      document.getElementById("notebookEditor").style.display = "none"; // Hide the editor after deletion
      loadNotebooks(); // Reload the notebook list
    }
  } else {
    console.error("No notebook selected for deletion.");
  }
});

const cancelNotebookEditBtn = document.getElementById("cancelNotebookEditBtn");
cancelNotebookEditBtn.addEventListener("click", () => {
  // Hide the notebook editor
  document.getElementById("notebookEditor").style.display = "none";

  // Hide the version history panel if it's open
  const versionHistory = document.getElementById("versionHistory");
  if (versionHistory.style.display === "block") {
    versionHistory.style.display = "none";
  }

  console.log("Notebook editor and version history closed");
});
