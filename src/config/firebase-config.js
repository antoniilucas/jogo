import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQs4JrDmOdUPxUDL4t01O8Dh6EGvlpjHQ",
  authDomain: "game-2d-web.firebaseapp.com",
  projectId: "game-2d-web",
  storageBucket: "game-2d-web.appspot.com",
  messagingSenderId: "616215262406",
  appId: "1:616215262406:web:f133b52abb4681ac9993c7"
}

// Inicializa e exporta os serviços
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);