const BASE_URL2 =
  "https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler.json";

const gorevDüzenle = document.querySelector(".gorevitem3");

gorevDüzenle.addEventListener("click", () => {
  duzenleGorevleriYazdir();
});

async function veriCek() {
  try {
    const response = await fetch(`${BASE_URL2}`);
    if (!response.ok) {
      throw new Error("Ağ yanıtı başarılı olmadı");
    }
    const data = await response.json();

    const gorevlerim = [];

    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (item) {
        gorevlerim.push({ id: key, ...item });
      }
    });

    return gorevlerim;
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
  const silURL = `https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler/${gorevId}.json`;

  try {
    const response = await fetch(silURL, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Görev silinirken hata oluştu");
    }

    // Başarılı silme işleminden sonra DOM'dan da sil
    event.target.closest(".gorev-duzenle-item").remove();
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
  document.getElementById("gorev-tarih-input").value = gorevBitisTarihi;

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
  const gorevBitisTarihi = document.getElementById("gorev-tarih-input").value;
  const oncelikSeviyesi = document.querySelector(
    'input[name="oncelik-seviyesi"]:checked'
  ).value;

  const guncelURL = `https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler/${gorevId}.json`;

  try {
    const response = await fetch(guncelURL);
    if (!response.ok) {
      throw new Error("Görev güncellenirken hata oluştu");
    }
    const gorev = await response.json();

    gorev.gorevAd = gorevAd;
    gorev.gorevBitisTarihi = gorevBitisTarihi;
    gorev.oncelikSeviyesi = oncelikSeviyesi;

    const responseUpdate = await fetch(guncelURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gorev),
    });

    if (!responseUpdate.ok) {
      throw new Error("Görev güncellenirken hata oluştu");
    }

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
  const yapildimi = checkbox.checked;

  const guncelURL = `https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler/${gorevId}.json`;

  try {
    const response = await fetch(guncelURL);
    if (!response.ok) {
      throw new Error("Görev güncellenirken hata oluştu");
    }
    const gorev = await response.json();

    gorev.yapıldımı = yapildimi;

    const responseUpdate = await fetch(guncelURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gorev),
    });

    if (!responseUpdate.ok) {
      throw new Error("Görev güncellenirken hata oluştu");
    }

    // Checkbox işaretli ise görevin üstünü çiz, aksi takdirde kaldır
    if (yapildimi) {
      checkbox.nextElementSibling.classList.add("gorev-tamamlandi");
    } else {
      checkbox.nextElementSibling.classList.remove("gorev-tamamlandi");
    }
  } catch (error) {
    console.error("Görev güncellenirken hata oluştu:", error);
  }
}

// Sayfa yüklendiğinde görevleri çek ve göster
document.addEventListener("DOMContentLoaded", duzenleGorevleriYazdir);
