let gorevlerim = [];
let inputtext = document.querySelector("#gorev-input");
let inputDate = document.querySelector("#gorev-tarih-input");
let radioButtons = document.getElementsByName("oncelik-seviyesi");
let gorevYazdir = document.querySelector(".girilen-gorev-ul");
let form = document.querySelector(".gorev-ekle-form");
const ornekGorevler = document.querySelectorAll(".ornek");

form.addEventListener("submit", gorev);
ornekGorevler.forEach((li) => {
  li.addEventListener("click", function () {
    // Tıklanan örnek görevin metnini al
    const selectedGorev = this.textContent;

    // Alınan metni input elemanına atayın
    const gorevInput = document.getElementById("gorev-input");
    gorevInput.value = selectedGorev;
  });
});
function gorev(event) {
  event.preventDefault();
  if (inputtext.value.trim() == "") {
    alert("lütfen görev giriniz");
  } else {
    arayüzGorevEkle();
  }
}
function arayüzGorevEkle() {
  var selectedValue;
  radioButtons.forEach((radioButton) => {
    // Seçilen radio button kontrolü
    if (radioButton.checked) {
      let selectClass = radioButton.parentElement;

      selectedValue = selectClass.children[1].textContent;
    }
  });

  gorevlerim.push({
    gorevId: Math.floor(Math.random() * 9999999),
    gorevAd: inputtext.value.trim(),
    gorevBaslangicTarihi: new Date().toLocaleString(),
    gorevBitisTarihi: inputDate.value,
    oncelikSeviyesi: selectedValue,
    yapıldımı: false,
    kullaniciId: "0",
  });
  inputtext.value = "";
  inputDate.value = "";
  selectedValue = false;
  veriTabanınaYazdir();
}

function veriTabanınaYazdir() {
  var gorevGonder = new XMLHttpRequest();
  gorevGonder.open(
    "POST",
    "https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler.json",
    true
  );
  gorevGonder.setRequestHeader("Content-Type", "application/json");

  gorevGonder.onload = function () {
    if (gorevGonder.status >= 200 && gorevGonder.status < 400) {
      console.log("Görev başarıyla kaydedildi.");
    } else {
      console.error("Görev kaydedilirken bir hata oluştu.");
    }
  };

  gorevGonder.onerror = function () {
    console.error("İstek yapılamadı.");
  };

  var veri = JSON.stringify(gorevlerim[gorevlerim.length - 1]); // Son eklenen görevin verisini al
  gorevGonder.send(veri);
  console.log(gorevlerim);
}
