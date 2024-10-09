<h1>Collaborative Note-Taking App</h1>

<!-- Video Section -->
<h2>Watch the Overview</h2>
<p>Check out the video overview of the Collaborative Note-Taking App:</p>
<a href="https://www.youtube.com/watch?v=HaQ_8vKogPk" target="_blank">
  <img src="https://img.youtube.com/vi/HaQ_8vKogPk/0.jpg" alt="Collaborative Note-Taking App Overview" width="600px">
</a>

<p><a href="https://www.youtube.com/watch?v=HaQ_8vKogPk" target="_blank">Click here to watch the video on YouTube</a></p>

<hr>

<h2>Overview</h2>
<p>
  The Collaborative Note-Taking App allows multiple users to create, edit, and share notes in real-time. Users can create notebooks, store notes within those notebooks, and collaborate on them. The app supports real-time updates, version control, and user authentication.
</p>

<hr>

<h2>Features</h2>
<ul>
  <li><strong>User Authentication:</strong> Secure login and registration using Firebase Authentication.</li>
  <li><strong>Note Creation and Management:</strong> Users can create, edit, delete notes, and organize them into notebooks.</li>
  <li><strong>Real-Time Collaboration:</strong> Notes are updated in real-time using Firebase Firestore.</li>
  <li><strong>Version History:</strong> Keep track of changes to notes and revert to previous versions if needed.</li>
  <li><strong>Responsive Design:</strong> The app is optimized for both desktop and mobile views.</li>
</ul>

<hr>

<h2>Installation</h2>
<ol>
  <li>
    <strong>Clone the repository:</strong>
    <pre>
<code>git clone https://github.com/your-username/collaborative-note-taking-app.git
cd collaborative-note-taking-app
</code>
    </pre>
  </li>
  
  <li>
    <strong>Install dependencies:</strong>
    <pre><code>npm install</code></pre>
  </li>

  <li>
    <strong>Set up Firebase:</strong>
    <ul>
      <li>Create a Firebase project in the <a href="https://console.firebase.google.com/">Firebase Console</a>.</li>
      <li>Enable Firebase Authentication and Firestore.</li>
      <li>Replace the Firebase configuration in the <code>app.js</code> file with your project’s credentials:</li>
    </ul>
    <pre>
<code>
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};
</code>
    </pre>
  </li>

  <li>
    <strong>Run the app:</strong>
    <pre><code>npm start</code></pre>
  </li>
</ol>

<hr>

<h2>Usage</h2>
<ol>
  <li><strong>Login/Signup:</strong> Use the login or signup screen to create a new account or log in with existing credentials.</li>
  <li><strong>Creating a Notebook:</strong> Once logged in, create a new notebook by clicking the “New Notebook” button. Enter a notebook title and save it.</li>
  <li><strong>Creating and Editing Notes:</strong> Click on any notebook to open it. Add new notes by clicking the “New Note” button, or click on existing notes to edit them. Save your changes, or delete notes if necessary.</li>
  <li><strong>Version History:</strong> For any note, click on “View Version History” to see past versions and revert to them.</li>
</ol>

<hr>

<h2>Technologies Used</h2>
<ul>
  <li><strong>Frontend:</strong> HTML, CSS, JavaScript</li>
  <li><strong>Backend:</strong> Firebase Firestore for real-time database, Firebase Authentication for user management</li>
</ul>


<hr>

<h2>Contributing</h2>
<ol>
  <li>Fork the repository.</li>
  <li>Create a new feature branch: <pre><code>git checkout -b feature-branch-name</code></pre></li>
  <li>Make your changes and commit them: <pre><code>git commit -m "Your commit message"</code></pre></li>
  <li>Push to the branch: <pre><code>git push origin feature-branch-name</code></pre></li>
  <li>Create a new Pull Request.</li>
</ol>
