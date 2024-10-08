import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Handle sign-up form
export function setupSignup() {
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = signupForm["signupEmail"].value;
    const password = signupForm["signupPassword"].value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        signupForm.reset();
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
      });
  });
}

// Handle login form
export function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage"); // Add an element in the HTML to show the message

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the user info
    const email = loginForm["loginEmail"].value;
    const password = loginForm["loginPassword"].value;

    // Clear any previous error message
    errorMessage.textContent = "";

    // Sign in the user using Firebase Auth
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        loginForm.reset();
        // Redirect or update the UI for logged-in user
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);

        // Handle Firebase Auth errors
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage.textContent = "User does not exist. Please sign up.";
            break;
          case "auth/wrong-password":
            errorMessage.textContent = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage.textContent =
              "Invalid email format. Please check and try again.";
            break;
          case "auth/invalid-credential":
            errorMessage.textContent =
              "Invalid login credentials. Please try again.";
            break;
          default:
            errorMessage.textContent =
              "An error occurred. Please try again later.";
            break;
        }

        // Optionally log the error for debugging purposes
      });
  });
}

// Handle logout
export function setupLogout() {
  const logoutButton = document.getElementById("logoutLink");

  logoutButton.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        document.getElementById("notesList").innerHTML = "";
        document.getElementById("noteEditor").style.display = "none";
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("notesContainer").style.display = "none";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  });
}

function handleAuthError(error, errorMessage) {
  switch (error.code) {
    case "auth/user-not-found":
      errorMessage.textContent = "User does not exist.";
      break;
    case "auth/wrong-password":
      errorMessage.textContent = "Incorrect password.";
      break;
    case "auth/invalid-email":
      errorMessage.textContent = "Invalid email format.";
      break;
    default:
      errorMessage.textContent = "An error occurred.";
  }
}
