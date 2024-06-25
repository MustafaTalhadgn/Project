import { db } from "./firebase.js"; // firebase.js dosyasını içe aktar

import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let gorevler = [];
const inputtext = document.querySelector("#gorev-input");
const inputDate = document.querySelector("#gorev-tarih-input");
const radioButtons = document.getElementsByName("oncelik-seviyesi");
const form = document.querySelector(".gorev-ekle-form");
const ornekGorevler = document.querySelectorAll(".ornek");

form.addEventListener("submit", gorev);
ornekGorevler.forEach((li) => {
  li.addEventListener("click", function () {
    const selectedGorev = this.textContent;
    const gorevInput = document.getElementById("gorev-input");
    gorevInput.value = selectedGorev;
  });
});

async function gorev(event) {
  event.preventDefault();
  if (inputtext.value.trim() === "" || inputDate.value === "") {
    alert("Lütfen boş yerleri doldurunuz");
  } else {
    await arayuzGorevEkle();
  }
}

async function arayuzGorevEkle() {
  let selectedValue;
  radioButtons.forEach((radioButton) => {
    if (radioButton.checked) {
      let selectClass = radioButton.parentElement;
      selectedValue = selectClass.children[1].textContent;
    }
  });

  const userid = await fetchUserId();

  if (!userid) {
    alert("Kullanıcı ID alınamadı. Lütfen tekrar deneyin.");
    return;
  }

  const yeniGorev = {
    gorevAd: inputtext.value.trim(),
    gorevBaslangicTarihi: new Date().toLocaleString(),
    gorevBitisTarihi: inputDate.value,
    oncelikSeviyesi: selectedValue,
    yapildimi: false,
    kullaniciId: userid,
  };

  gorevler.push(yeniGorev);

  inputtext.value = "";
  inputDate.value = "";
  radioButtons.forEach((radioButton) => (radioButton.checked = false));
  await veriTabaninaYazdir(yeniGorev);
}

async function fetchUserId() {
  try {
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
  } catch (error) {
    console.error("Kullanıcı ID çekme hatası: ", error);
    return null;
  }
}

async function veriTabaninaYazdir(gorev) {
  try {
    await addDoc(collection(db, "tasks"), gorev);
    console.log("Görev başarıyla kaydedildi.");
    // Görevlerim sayfasına görevlerin güncellendiğini bildiren bir event yayınla
    window.dispatchEvent(new CustomEvent("gorevEklendi"));
  } catch (error) {
    console.error("Görev kaydedilirken bir hata oluştu: ", error);
  }
}
