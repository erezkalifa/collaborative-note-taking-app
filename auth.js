import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Handle sign-up form
export function setupSignup() {
  const signupForm = document.getElementById("signupForm");
  const signupErrorMessage = document.getElementById("signupErrorMessage"); // Make sure you use this
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user input
    const email = signupForm["signupEmail"].value;
    const password = signupForm["signupPassword"].value;

    try {
      // Firebase sign-up with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up successfully:", userCredential.user);

      // Reset form and clear any error messages
      signupForm.reset();
      signupErrorMessage.textContent = ""; // Use this variable for error messages

      // Redirect user or show a success message
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("signupContainer").style.display = "none"; // Hide signup form
      document.getElementById("notesContainer").style.display = "flex"; // Show notes container

      // Additional UI setup can go here if needed
    } catch (error) {
      // Handle errors and display user-friendly error messages
      switch (error.code) {
        case "auth/email-already-in-use":
          signupErrorMessage.textContent =
            "Email is already in use. Try another.";
          break;
        case "auth/invalid-email":
          signupErrorMessage.textContent = "Invalid email format.";
          break;
        case "auth/weak-password":
          signupErrorMessage.textContent =
            "Password is too weak. Use a stronger password.";
          break;
        default:
          signupErrorMessage.textContent = "Sign up failed. Please try again.";
      }
      console.error("Error signing up:", error);
    }
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

export function handleAuthError(error, errorMessage) {
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

// Show the sign-up form and hide the login form
document.getElementById("showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("signupContainer").style.display = "block";
});

// Show the login form and hide the sign-up form
document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user);

    // Hide the login and signup forms
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("signupContainer").style.display = "none";

    // Show the main content (e.g., the notes section)
    document.getElementById("notesContainer").style.display = "flex";
  } else {
    console.log("User is logged out");

    // Show the login form and hide the rest
    document.getElementById("notesContainer").style.display = "none";
    document.getElementById("signupContainer").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
  }
});
