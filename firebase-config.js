// Firebase config para órdenes de trabajo
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC80hM7mF-ImkvHePOLwPFL2N7xDqSUURA",
  authDomain: "ordenes-trabajo-a8499.firebaseapp.com",
  projectId: "ordenes-trabajo-a8499",
  storageBucket: "ordenes-trabajo-a8499.appspot.com",
  messagingSenderId: "922107148938",
  appId: "1:922107148938:web:b83f6923e98e9d42224b73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
