// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  collection,
  doc,
  getDoc,
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

const dataAl = async () => {
  const q = query(collection(db, "users"), where("giris", "==", true));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let userId = null;
    querySnapshot.forEach((doc) => {
      userId = doc.id;
    });
    return userId;
  } else {
    return null;
  }
};

const kullanıcıGöster = async (id) => {
  if (!id) return;

  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const kullanıcıGirisi = userSnap.data();
    const yazdir = document.querySelector(".kullanici");
    const div = document.createElement("div");
    div.className = "kullanici-body";
    div.innerHTML = `
        ${kullanıcıGirisi.isim} ${kullanıcıGirisi.soyisim}
        `;
    yazdir.appendChild(div);
  }
};

const kullanıcıCıkıs = async (id) => {
  if (!id) return;

  const userRef = doc(db, "users", id);
  await updateDoc(userRef, {
    giris: false,
  });

  console.log("Kullanıcı çıkışı yapıldı");
};

const cıkısYap = async (id) => {
  window.addEventListener("beforeunload", async (event) => {
    await kullanıcıCıkıs(id);
    // Bu mesaj kullanıcının dikkatini çekmek için tarayıcıya bağlı olarak çalışabilir veya çalışmayabilir.
    event.returnValue = "Sayfadan ayrılmak istediğinize emin misiniz?";
  });

  const cikis = document.querySelector(".cikis");
  cikis.addEventListener("click", async () => {
    await kullanıcıCıkıs(id);
    alert("Kullanıcı çıkışı yapıldı");
    window.location.href = "../giris-yap.html";
  });
};

(async () => {
  const id = await dataAl();
  await kullanıcıGöster(id);
  await cıkısYap(id);
})();
