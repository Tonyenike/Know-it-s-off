import firebase from 'firebase/app';
import 'firebase/messaging';

 // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCGG2bVOzc9jR_dPhNlTxEn_ZTajkcHVzo",
    authDomain: "know-its-off-jsyg.firebaseapp.com",
    projectId: "know-its-off-jsyg",
    storageBucket: "know-its-off-jsyg.appspot.com",
    messagingSenderId: "1039398438265",
    appId: "1:1039398438265:web:f0e1ae04a1db6c68025ba8"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);