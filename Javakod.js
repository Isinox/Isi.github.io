// Obsługa kliknięć w FanArt
document.getElementById('fanart-link').addEventListener('click', () => {
  const list = rankingData['fanart'] || [];
  let html = `
    <h2>FanArt - Najlepsze prace fanów</h2>
    <div class="gallery">
      ${list.map(item => `
        <div class="art-card">
          <img src="${item.img}" alt="${item.name}" class="fanart-img" data-src="${item.img}">
          <p>${item.name}</p>
        </div>
      `).join('')}
    </div>
    <div id="modal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="modal-img">
    </div>`;
  
  main.innerHTML = html;

  // Dodajemy obsługę kliknięć w zdjęcia
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close');
  
  document.querySelectorAll('.fanart-img').forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = 'block';
      modalImg.src = img.dataset.src;
    });
  });
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
const games = {
  // ... (pozostałe kategorie)
  info: {
    title: "O stronie",
    content: `
      <h2>Informacje o stronie</h2>
      <p>Ta strona prezentuje rankingi najlepszych gier w różnych kategoriach na rok 2025.</p>
      <p>Możesz tu znaleźć:</p>
      <ul>
        <li>Top 10 gier w różnych kategoriach</li>
        <li>Fanarty stworzone przez społeczność</li>
        <li>Muzykę gamingową do słuchania</li>
      </ul>
      <p>Strona stworzona przez pasjonatów gier dla pasjonatów gier!</p>
    `
  }
};