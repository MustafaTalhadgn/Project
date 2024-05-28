document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("girisForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const sifre = document.getElementById("sifre").value;

    try {
      const response = await fetch(
        `https://gorevhanekayit-default-rtdb.firebaseio.com/1.json`
      );
      const data = await response.json();

      let userFound = false;
      let userId = null;

      // Kullanıcıları döngü ile kontrol et
      for (const id in data) {
        const user = data[id];
        if (user.email === email && user.sifre === sifre) {
          userFound = true;
          userId = id;
          break;
        }
      }

      if (userFound) {
        await kullanıcıGirisi(userId);
        alert("Giriş başarılı!");
        window.location.href = "program.html";
      } else {
        alert("Hatalı email veya şifre.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Giriş sırasında bir hata oluştu.");
    }
  });

  const kullanıcıGirisi = async (id) => {
    const guncelURL = `https://gorevhanekayit-default-rtdb.firebaseio.com/1/${id}.json`;

    try {
      const response = await fetch(guncelURL);
      if (!response.ok) {
        throw new Error("Kullanıcı bilgisi alınırken hata oluştu");
      }

      const kullanıcı = await response.json();
      // Kullanıcı bilgilerini loglayın

      // Kullanıcı giriş yaptı, giris alanını true yapın
      kullanıcı.giris = true;

      // Kullanıcı bilgilerini güncelleme işlemleri
      const responseUpdate = await fetch(guncelURL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kullanıcı),
      });

      if (!responseUpdate.ok) {
        throw new Error("Kullanıcı güncellenirken hata oluştu");
      }

      console.log("Kullanıcı başarıyla güncellendi");
    } catch (error) {
      console.error("Kullanıcı güncellenirken hata oluştu:", error);
    }
  };
});
