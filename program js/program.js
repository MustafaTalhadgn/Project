const menuGorevlerim = document.querySelector(".gorevitem1");
const menuGorevEkle = document.querySelector(".gorevitem2");
const menuGorevDuzenle = document.querySelector(".gorevitem3");
const menuTamamlananGorevler = document.querySelector(".gorevitem4");
const menuTakvim = document.querySelector(".gorevitem5");
const gorevGöster = document.querySelector(".gorevlerim");
const gorevEkle = document.querySelector(".gorev-ekle");
const gorevDuzenle = document.querySelector(".gorev-duzenle");
const tamamlananGorevler = document.querySelector(".tamamlanan-gorevler");
const takvim = document.querySelector(".takvim");

menuGorevlerim.addEventListener("click", (e) => {
  gorevGöster.style.display = "block";
  gorevEkle.style.display = "none";
  gorevDuzenle.style.display = "none";
  tamamlananGorevler.style.display = "none";
  takvim.style.display = "none";
  e.preventDefault();
});
menuGorevEkle.addEventListener("click", (e) => {
  gorevGöster.style.display = "none";
  gorevDuzenle.style.display = "none";
  tamamlananGorevler.style.display = "none";
  takvim.style.display = "none";
  gorevEkle.style.display = "grid";
  e.preventDefault();
});
menuGorevDuzenle.addEventListener("click", (e) => {
  gorevEkle.style.display = "none";
  gorevGöster.style.display = "none";
  tamamlananGorevler.style.display = "none";
  takvim.style.display = "none";
  gorevDuzenle.style.display = "block";
  e.preventDefault();
});
menuTamamlananGorevler.addEventListener("click", (e) => {
  gorevEkle.style.display = "none";
  gorevDuzenle.style.display = "none";
  tamamlananGorevler.style.display = "none";
  takvim.style.display = "none";
  tamamlananGorevler.style.display = "grid";

  e.preventDefault();
});
menuTakvim.addEventListener("click", (e) => {
  gorevEkle.style.display = "none";
  gorevDuzenle.style.display = "none";
  tamamlananGorevler.style.display = "none";
  takvim.style.display = "none";
  takvim.style.display = "block";
  e.preventDefault();
});
