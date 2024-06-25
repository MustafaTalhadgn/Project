import { db } from "./firebase.js"; // firebase.js dosyasını içe aktar

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Kullanıcı ID'sini çekmek için fonksiyon
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

// Tamamlanan görevleri çekip döndüren asenkron fonksiyon
async function tamamlananveriCek() {
  try {
    const userId = await fetchUserId();

    if (!userId) {
      console.error("Kullanıcı ID alınamadı.");
      return [];
    }

    const q = query(
      collection(db, "tasks"),
      where("kullaniciId", "==", userId),
      where("yapildimi", "==", true)
    );
    const querySnapshot = await getDocs(q);

    const gorevlerim = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return gorevlerim;
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
    return [];
  }
}

function tamamlananliEkle(gorevlerim) {
  const gorevTamamlaYazdir = document.querySelector(
    ".tamamlanan-gorevler-item-ul"
  );
  gorevTamamlaYazdir.innerHTML = "";
  gorevlerim.forEach((gorev) => {
    if (gorev.yapildimi) {
      let li = document.createElement("li");
      li.className = "gorev-tamamla-item";
      li.dataset.id = gorev.id;
      li.dataset.oncelik = gorev.oncelikSeviyesi;

      // Öncelik seviyesine göre arka plan rengini ayarla
      if (gorev.oncelikSeviyesi === "1") {
        li.style.border = "10px solid var(--danger)";
        li.style.borderRadius = "10px";
      } else if (gorev.oncelikSeviyesi === "2") {
        li.style.border = "10px solid var(--dark)";
        li.style.borderRadius = "10px";
      } else if (gorev.oncelikSeviyesi === "3") {
        li.style.border = "10px solid var(--info)";
        li.style.borderRadius = "10px";
      }

      li.innerHTML = `
        <div class="gorev-duzenle-gorevler">
          <span class="gorev-ad">${gorev.gorevAd}</span><br>
          <span class="gorev-bitis-tarihi">${gorev.gorevBitisTarihi}</span>
        </div>
      `;
      gorevTamamlaYazdir.appendChild(li);
    }
  });
}

async function tamamlananGorevleriYazdir() {
  const gorevlerim = await tamamlananveriCek();
  tamamlananliEkle(gorevlerim);
}

// Tamamlanan görevler butonuna tıklanınca görevleri yazdır
const tamamlananGorev = document.querySelector(".gorevitem4");
if (tamamlananGorev) {
  tamamlananGorev.addEventListener("click", () => {
    tamamlananGorevleriYazdir();
  });
} else {
  console.error(".gorevitem4 elementi bulunamadı.");
}
