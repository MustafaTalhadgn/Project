const dataAl = async () => {
  const data = await fetch(
    `https://gorevhanekayit-default-rtdb.firebaseio.com/1.json`
  );
  const kullanıcı = await data.json();
  var userid = null;
  for (var id in kullanıcı) {
    const users = kullanıcı[id];
    if (users.giris == true) {
      userid = id;
    }
  }
  return userid;
};

const kullanıcıGöster = async (id) => {
  const dataAl2 = await fetch(
    `https://gorevhanekayit-default-rtdb.firebaseio.com/1/${id}.json`
  );

  const kullanıcıGirisi = await dataAl2.json();
  const yazdir = document.querySelector(".kullanici");
  const div = document.createElement("div");
  div.className = "kullanici-body";
  div.innerHTML = `
  ${kullanıcıGirisi.isim} ${kullanıcıGirisi.soyisim}
  
  `;
  yazdir.appendChild(div);
};

const kullanıcıCıkıs = async (id) => {
  const dataAl3 = await fetch(
    `https://gorevhanekayit-default-rtdb.firebaseio.com/1/${id}.json`
  );
  const data = await dataAl3.json();
  data.giris = false;
  fetch(`https://gorevhanekayit-default-rtdb.firebaseio.com/1/${id}.json`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
};

const cıkısYap = async (id) => {
  window.addEventListener("beforeunload", async (id) => {
    await kullanıcıCıkıs(id);
    alert("kullanıcı cıkışı yapıldı");
    // No need to redirect as the page is unloading
  });
  const cikis = document.querySelector(".cikis");
  cikis.addEventListener("click", async () => {
    await kullanıcıCıkıs(id);
    alert("kullanıcı cıkışı yapıldı");
    window.location.href = "../giris-yap.html";
  });
};

(async () => {
  const id = await dataAl();
  kullanıcıGöster(id);
  cıkısYap(id);
})();
