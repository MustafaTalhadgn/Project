// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyDMHAjxUIGNYJfiN4-I_6riX9UjebSOM",
  authDomain: "gorevler-47350.firebaseapp.com",
  projectId: "gorevler-47350",
  storageBucket: "gorevler-47350.appspot.com",
  messagingSenderId: "1039990050808",
  appId: "1:1039990050808:web:dc4687f9690e7366d8100d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("girisForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const sifre = document.getElementById("sifre").value;

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("sifre", "==", sifre)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Hatalı email veya şifre.");
      } else {
        let userId = null;

        querySnapshot.forEach((doc) => {
          userId = doc.id;
        });

        await kullanıcıGirisi(userId);
        alert("Giriş başarılı!");
        window.location.href = "program.html";
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Giriş sırasında bir hata oluştu.");
    }
  });

  const kullanıcıGirisi = async (id) => {
    const userRef = doc(db, "users", id);

    try {
      // Kullanıcı giriş yaptı, giris alanını true yapın
      await updateDoc(userRef, {
        giris: true,
      });

      console.log("Kullanıcı başarıyla güncellendi");
    } catch (error) {
      console.error("Kullanıcı güncellenirken hata oluştu:", error);
    }
  };
});
