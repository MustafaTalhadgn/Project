const BASE_URL3 =
  "https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler.json";

const tamamlananGorev = document.querySelector(".gorevitem4");

tamamlananGorev.addEventListener("click", () => {
  tamamlananGorevleriYazdir();
});

async function tamamlananveriCek() {
  try {
    const response = await fetch(`${BASE_URL3}`);
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

function tamamlananliEkle(gorevlerim) {
  const gorevTamamlaYazdir = document.querySelector(
    ".tamamlanan-gorevler-item-ul"
  );
  gorevTamamlaYazdir.innerHTML = "";
  gorevlerim.forEach((gorev) => {
    if (gorev.yapıldımı) {
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
  const gorevlerim = await veriCek();
  tamamlananliEkle(gorevlerim);
}
