import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCfWUOi8a49S-3_8MXlOhyQXi2_7ofwyyQ",
  authDomain: "smart-market-43874.firebaseapp.com",
  projectId: "smart-market-43874",
  storageBucket: "smart-market-43874.appspot.com",
  messagingSenderId: "421103934360",
  appId: "1:421103934360:web:d1fef228c5ceaf060669ed",
  measurementId: "G-JKZ9N9PEBH",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export default app;
