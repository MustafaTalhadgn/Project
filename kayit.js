// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
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
  const form = document.getElementById("kayitForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isim = document.getElementById("isim").value;
    const soyisim = document.getElementById("soyisim").value;
    const email = document.getElementById("email").value;
    const sifre = document.getElementById("sifre").value;
    const cinsiyet = document.getElementById("cinsiyet").value;
    const dogumTarihi = document.getElementById("dogum-tarihi").value;

    if (isim === "" || email === "" || sifre === "") {
      alert("Alanları boş geçemezsiniz");
      return;
    }

    const kullanicilar = {
      isim,
      soyisim,
      email,
      sifre,
      cinsiyet,
      dogumTarihi,
      giris: false,
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "users"), kullanicilar);
      console.log("Kullanıcı ID'si: ", docRef.id);
      alert("Kayıt başarılı!");

      // Kayıt başarılı olduğunda görevi ekle
      await gorevEkle(docRef.id);

      window.location.href = "giris-yap.html";
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Kayıt sırasında bir hata oluştu.");
    }
  });
});

async function gorevEkle(userId) {
  // Görev ekleme kodunu buraya ekle
  const inputtext = "Yeni Görev"; // Burada görev adı alınabilir
  const inputDate = new Date().toISOString().split("T")[0]; // Bugünün tarihini alır
  const selectedValue = "Yüksek"; // Örnek öncelik seviyesi
  const yeniGorev = {
    gorevAd: inputtext,
    gorevBaslangicTarihi: new Date().toLocaleString(),
    gorevBitisTarihi: inputDate,
    oncelikSeviyesi: selectedValue,
    yapildimi: false,
    kullaniciId: userId,
  };

  try {
    await addDoc(collection(db, "tasks"), yeniGorev);
    console.log("Görev başarıyla kaydedildi.");
  } catch (error) {
    console.error("Görev kaydedilirken bir hata oluştu: ", error);
  }
}
