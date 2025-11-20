import { getAnalytics } from "firebase/analytics";
// import { getStorage } from "firebase/storage";
// import { initializeApp } from "firebase/app";
// const firebaseConfig = {
//   apiKey: "AIzaSyCfWUOi8a49S-3_8MXlOhyQXi2_7ofwyyQ",
//   authDomain: "smart-market-43874.firebaseapp.com",
//   projectId: "smart-market-43874",
//   storageBucket: "smart-market-43874.appspot.com",
//   messagingSenderId: "421103934360",
//   appId: "1:421103934360:web:d1fef228c5ceaf060669ed",
//   measurementId: "G-JKZ9N9PEBH",
// };
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
// export default app;
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfWUOi8a49S-3_8MXlOhyQXi2_7ofwyyQ",
  authDomain: "smart-market-43874.firebaseapp.com",
  projectId: "smart-market-43874",
  storageBucket: "smart-market-43874.firebasestorage.app",
  messagingSenderId: "421103934360",
  appId: "1:421103934360:web:0dd5afbb731c95130669ed",
  measurementId: "G-KZJSWQ42FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);