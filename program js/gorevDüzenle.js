import { db } from "./firebase.js"; // firebase.js dosyasını içe aktar

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
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

// Görevleri çekip döndüren asenkron fonksiyon
async function veriCek() {
  try {
    const userId = await fetchUserId();

    if (!userId) {
      console.error("Kullanıcı ID alınamadı.");
      return [];
    }

    const q = query(
      collection(db, "tasks"),
      where("kullaniciId", "==", userId)
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

function gorevliEkle(gorevlerim) {
  const gorevDuzenleYazdir = document.querySelector(".gorev-duzenle-ul");
  gorevDuzenleYazdir.innerHTML = "";
  gorevlerim.forEach((gorev) => {
    let li = document.createElement("li");
    li.className = "gorev-duzenle-item";
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
      <input class="gorev-inp" type="checkbox" ${
        gorev.yapıldımı ? "checked" : ""
      } onchange="toggleGorev(event)">
      <div class="gorev-duzenle-gorevler ${
        gorev.yapıldımı ? "gorev-tamamlandi" : ""
      }">
        <span class="gorev-ad">${gorev.gorevAd}</span><br>
        <span class="gorev-bitis-tarihi">${gorev.gorevBitisTarihi}</span>
      </div>
      <div class="icons">
        <i class="fa-solid fa-trash" onclick="silGorev(event)"></i>
        <i class="fa-solid fa-pen" onclick="duzenleGorev(event)"></i>
      </div>
    `;
    gorevDuzenleYazdir.appendChild(li);
  });
}

async function duzenleGorevleriYazdir() {
  const gorevlerim = await veriCek();
  gorevliEkle(gorevlerim);
}

// Görev Silme Fonksiyonu
async function silGorev(event) {
  const gorevId = event.target.closest(".gorev-duzenle-item").dataset.id;
  try {
    await deleteDoc(doc(db, "tasks", gorevId));
    event.target.closest(".gorev-duzenle-item").remove();

    // Görev silindikten sonra özel olayı tetikle
    const eventSil = new CustomEvent("gorevSilindi", {
      detail: {
        gorevId,
      },
    });
    window.dispatchEvent(eventSil);
  } catch (error) {
    console.error("Görev silinirken hata oluştu:", error);
  }
}

function duzenleGorev(event) {
  const gorevId = event.target.closest(".gorev-duzenle-item").dataset.id;
  const gorev = event.target.closest(".gorev-duzenle-item");
  const gorevAd = gorev.querySelector(".gorev-ad").textContent;
  const gorevBitisTarihi = gorev.querySelector(
    ".gorev-bitis-tarihi"
  ).textContent;
  const gorevOncelik = gorev.dataset.oncelik;

  document.getElementById("gorev-duzenle-input").value = gorevAd;
  document.getElementById("gorev-tarih-input2").value = gorevBitisTarihi;

  const oncelikInput = document.querySelector(
    `input[name="oncelik-seviyesi"][value="${gorevOncelik}"]`
  );
  if (oncelikInput) {
    oncelikInput.checked = true;
  } else {
    console.error(`Geçersiz öncelik seviyesi: ${gorevOncelik}`);
  }

  document.getElementById("gorevGuncelleForm").style.display = "grid";
  document.getElementById("guncelleId").value = gorevId;
}

async function guncelle() {
  const gorevId = document.getElementById("guncelleId").value;
  const gorevAd = document.getElementById("gorev-duzenle-input").value;
  const gorevBitisTarihi = document.getElementById("gorev-tarih-input2").value;
  const oncelikSeviyesi = document.querySelector(
    'input[name="oncelik-seviyesi"]:checked'
  ).value;

  try {
    await updateDoc(doc(db, "tasks", gorevId), {
      gorevAd,
      gorevBitisTarihi,
      oncelikSeviyesi,
    });

    // Görev güncellendikten sonra özel olayı tetikle
    const event = new CustomEvent("gorevGuncellendi", {
      detail: {
        gorevId,
        gorevAd,
        gorevBitisTarihi,
        oncelikSeviyesi,
      },
    });
    window.dispatchEvent(event);

    duzenleGorevleriYazdir();
    formuKapat();
  } catch (error) {
    console.error("Görev güncellenirken hata oluştu:", error);
  }
}
function formuKapat() {
  document.getElementById("gorevGuncelleForm").style.display = "none";
}

// Checkbox değiştirildiğinde çağrılacak fonksiyon
async function toggleGorev(event) {
  const checkbox = event.target;
  const gorevId = checkbox.closest(".gorev-duzenle-item").dataset.id;
  try {
    await updateDoc(doc(db, "tasks", gorevId), {
      yapildimi: checkbox.checked,
    });

    checkbox.nextElementSibling.classList.toggle(
      "gorev-tamamlandi",
      checkbox.checked
    );
  } catch (error) {
    console.error("Görev durumu güncellenirken hata oluştu:", error);
  }
}
// Fonksiyonları global kapsamda erişilebilir hale getirin
window.silGorev = silGorev;
window.duzenleGorev = duzenleGorev;
window.guncelle = guncelle;
window.formuKapat = formuKapat;
window.toggleGorev = toggleGorev;

// Sayfa yüklendiğinde görevleri çek ve göster
document.addEventListener("DOMContentLoaded", duzenleGorevleriYazdir);

// Görev eklendiğinde listeyi güncelle
window.addEventListener("gorevEklendi", async () => {
  duzenleGorevleriYazdir();
});
