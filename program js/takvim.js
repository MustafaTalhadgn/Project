document.addEventListener("DOMContentLoaded", async function () {
  var takvimEl = document.querySelector(".takvim");

  var takvim = new FullCalendar.Calendar(takvimEl, {
    initialView: "dayGridMonth",
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const gorevlerim = await veriCek();
        const events = gorevlerim.map((gorev) => ({
          title: gorev.gorevAd,
          start: gorev.gorevBitisTarihi,
          allDay: true,
        }));
        successCallback(events);
      } catch (error) {
        console.error("Veriler alınırken hata oluştu:", error);
        failureCallback(error);
      }
    },
  });

  takvim.render();
});

async function veriCek() {
  const BASE_URL2 =
    "https://gorevhanekayit-default-rtdb.firebaseio.com/gorevler.json";
  try {
    const response = await fetch(`${BASE_URL2}`);
    if (!response.ok) {
      throw new Error("Ağ yanıtı başarılı olmadı");
    }
    const data = await response.json();
    const gorevlerim = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    return gorevlerim;
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
    return [];
  }
}
