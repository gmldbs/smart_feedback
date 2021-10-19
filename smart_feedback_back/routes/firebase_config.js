const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyCyP12_GNBAc7JM2dKoCumP2qsqNNGwotE",
  authDomain: "smartfeedback-e67ce.firebaseapp.com",
  projectId: "smartfeedback-e67ce",
  storageBucket: "smartfeedback-e67ce.appspot.com",
  messagingSenderId: "931637563443",
  appId: "1:931637563443:web:92910e2f5b335f39095346",
  measurementId: "G-FNS5H7F0ML"
};

firebase.initializeApp(firebaseConfig)

module.exports = firebase;