// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ9ZrozA-AMZ3Tj19tPs_wA2COD7clzHA",
  authDomain: "test-project-a83ce.firebaseapp.com",
  databaseURL: "https://test-project-a83ce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-project-a83ce",
  storageBucket: "test-project-a83ce.firebasestorage.app",
  messagingSenderId: "469433209063",
  appId: "1:469433209063:web:912c7fd47a7de666389242",
  measurementId: "G-EK6MLNQTZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log(db);
const analytics = getAnalytics(app);

// Function to write user data to Firebase Realtime Database
// Function to write user data with unique ID
function writeUserData(userId, firstName, lastName, age, gender, email, phone, address, academicQualification, jobTitle) {
  // Create a reference to 'users' collection
  const usersRef = ref(db, 'users/' + userId);

  // push() generates a unique key for the new child
  //const newUserRef = push(usersRef);

  // set() stores the data at that unique location
  set(usersRef, {
    firstName: firstName,
    lastName: lastName,
    age: age,
    gender: gender,
    email: email,
    phone: phone,
    address: address,
    academicQualification: academicQualification,
    jobTitle: jobTitle
  })
  .then(() => {
    console.log("User added successfully with ID:", userId);
  })
  .catch((error) => {
    console.error("Error adding user:", error);
  });
}

// Expose the function to the global scope so it can be accessed from HTML (e.g., via button click)
window.writeUserData = writeUserData;

// ref(db, 'users') points to the users path.
// get(userRef) gets the data at that path.
// snapshot.forEach(...) loops over each child node (each user).
// childsnapshot.val() gives the actual data (name and email), which is printed.
function readUser(){
    const userRef = ref(db,'users')
    get(userRef).then((snapshot)=>{
        snapshot.forEach((childsnapshot)=>{
            console.log(childsnapshot.val());
        })
    })
}
//readUser()
window.readUser = readUser;

function updateUserData(userId, updatedData) {
  const userRef = ref(db, 'users/' + userId);
  update(userRef, updatedData)
    .then(() => {
      console.log("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

// Example usage:
//updateUserData();
window.updateUserData = updateUserData;

function deleteUserData(userId) {
  const userRef = ref(db, 'users/' + userId);
  remove(userRef)
    .then(() => {
      console.log("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

// Example usage:
//deleteUserData(2);
window.deleteUserData = deleteUserData;