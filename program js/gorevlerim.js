const BASE_URL =
  "https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler.json";

// Görevleri çekip döndüren asenkron fonksiyonü
const gorevlerimBas = document.querySelector(".gorevitem1 ");
gorevlerimBas.addEventListener("click", () => {
  dataGorevleriYazdir();
});
async function veriCek() {
  try {
    const response = await fetch(`${BASE_URL}`);
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
      li.style.backgroundColor = "var(--dark)";
    } else if (gorev.oncelikSeviyesi === "3") {
      li.style.backgroundColor = "var(--info)";
    }

    li.innerHTML = `

      <div class="gorev-duzenle-gorevler">
        <span class="gorev-ad">${gorev.gorevAd}</span><br>
        <span class="gorev-bitis-tarihi">${gorev.gorevBitisTarihi}</span>
      </div>
    `;
    gorevDuzenleYazdir.appendChild(li);
  });
}

async function dataGorevleriYazdir() {
  const gorevlerim = await veriCek();
  dataliEkle(gorevlerim);
}
