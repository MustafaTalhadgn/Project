document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kayitForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isim = document.getElementById("isim").value;
    const soyisim = document.getElementById("soyisim").value;
    const email = document.getElementById("email").value;
    const sifre = document.getElementById("sifre").value;
    const cinsiyet = document.getElementById("cinsiyet").value;
    const dogumTarihi = document.getElementById("dogum-tarihi").value;
    if (isim == "" && email == "" && sifre == "") {
      alert("alanları bos gecemezsin");
    }
    const formData = {
      isim,
      soyisim,
      email,
      sifre,
      cinsiyet,
      dogumTarihi,
      kullanıcıId: Math.floor(Math.random() * 9999999999999),
      giris: false,
    };

    try {
      const response = await fetch(
        "https://gorevhanekayit-default-rtdb.firebaseio.com/1.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert("Kayıt başarılı!");
      window.location.href = "giris-yap.html";
    } catch (error) {
      console.error("Error:", error);
      alert("Kayıt sırasında bir hata oluştu.");
    }
  });
});
