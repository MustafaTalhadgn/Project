import { db } from "./firebase.js"; // firebase.js dosyasını içe aktar

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Görevleri çekip döndüren asenkron fonksiyon
async function veriCek() {
  try {
    const userid = await fetchUserId();

    if (!userid) {
      console.error("Kullanıcı ID alınamadı.");
      return [];
    }

    const q = query(
      collection(db, "tasks"),
      where("kullaniciId", "==", userid)
    );
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
    return [];
  }
}

function dataliEkle(gorevlerim) {
  const gorevDuzenleYazdir = document.querySelector(".gorevlerim-item");
  gorevDuzenleYazdir.innerHTML = "";
  gorevlerim.forEach((gorev) => {
    let li = document.createElement("li");
    li.className = "gorev-yazdir-item";
    li.dataset.id = gorev.id;
    li.dataset.oncelik = gorev.oncelikSeviyesi;

    // Öncelik seviyesine göre arka plan rengini ayarla
    if (gorev.oncelikSeviyesi === "1") {
      li.style.backgroundColor = "var(--danger)";
      li.style.color = "#fff";
    } else if (gorev.oncelikSeviyesi === "2") {
      li.style.backgroundColor = "var(--warning)";
      li.style.color = "#fff";
    } else if (gorev.oncelikSeviyesi === "3") {
      li.style.backgroundColor = "var(--info)";
      li.style.color = "#fff";
    }
    const bugununTarihi = new Date();
    const gorevBitisTarihii = new Date(gorev.gorevBitisTarihi);
    const t = gorevBitisTarihii - bugununTarihi;
    const gun = Math.floor(t / (1000 * 60 * 60 * 24));
    const saat = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const dakika = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const saniye = Math.floor((t % (1000 * 60)) / 1000);
    if (saniye > 0) {
      li.innerHTML = `

      <div class="gorev-duzenle-gorevler">
        <span class="gorev-ad">${gorev.gorevAd}</span><br>
        <span class="gorev-bitis-tarihi">${gorev.gorevBitisTarihi}</span><br>
        <span class="kalan-sure">Kalan Süre:${gun} gün ${saat} saat ${dakika} dakika ${saniye} saniye<span/>
      </div>
    `;
      gorevDuzenleYazdir.appendChild(li);
    } else {
      li.innerHTML = `

      <div class="gorev-duzenle-gorevler">
        <span class="gorev-ad">${gorev.gorevAd}</span><br>
        <span class="gorev-bitis-tarihi">${gorev.gorevBitisTarihi}</span>
        
      </div>
    `;
      gorevDuzenleYazdir.appendChild(li);
    }
  });
}
// Sayfa yüklendiğinde verileri çek ve ekrana yazdır
document.addEventListener("DOMContentLoaded", async () => {
  const gorevlerim = await veriCek();
  dataliEkle(gorevlerim);

  // Görev eklendiğinde listeyi güncelle
  window.addEventListener("gorevEklendi", async () => {
    const gorevlerim = await veriCek();
    dataliEkle(gorevlerim);
  });

  // Görev güncellendiğinde listeyi güncelle
  window.addEventListener("gorevGuncellendi", async () => {
    const gorevlerim = await veriCek();
    dataliEkle(gorevlerim);
  });

  // Görev silindiğinde listeyi güncelle
  window.addEventListener("gorevSilindi", async () => {
    const gorevlerim = await veriCek();
    dataliEkle(gorevlerim);
  });
});
