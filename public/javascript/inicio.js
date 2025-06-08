import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDQs4JrDmOdUPxUDL4t01O8Dh6EGvlpjHQ",
  authDomain: "game-2d-web.firebaseapp.com",
  projectId: "game-2d-web",
  storageBucket: "game-2d-web.appspot.com",
  messagingSenderId: "616215262406",
  appId: "1:616215262406:web:f133b52abb4681ac9993c7"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

document.getElementById("login-btn").addEventListener("click", () => {
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("Usuário logado:", result.user)
    })
    .catch((error) => {
      console.error("Erro:", error)
    })
})