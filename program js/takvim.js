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
