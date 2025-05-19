
const main = document.getElementById('ranking');

// ================== Pytania ==================
function loadQuestions() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  try {
    const questions = JSON.parse(localStorage.getItem('gaming-questions')) || [];
    container.innerHTML = '<h3>Najnowsze pytania</h3>';

    if (questions.length === 0) {
      container.innerHTML += '<p>Brak pytań. Bądź pierwszy!</p>';
      return;
    }

    questions.slice().reverse().forEach(q => {
      container.innerHTML += `
        <div class="question-item">
          <div class="question-text">${q.text}</div>
          <div class="question-date">${q.date}</div>
          ${q.answer ? `<div class="answer-text"><strong>Odpowiedź:</strong> ${q.answer}</div>` : ''}
        </div>`;
    });
  } catch (error) {
    console.error('Błąd wczytywania pytań:', error);
    container.innerHTML += '<p>Wystąpił błąd przy ładowaniu pytań.</p>';
  }
}

function submitQuestion() {
  const questionText = document.getElementById('question-text')?.value.trim();
  if (!questionText) return;

  const now = new Date();
  const question = {
    text: questionText,
    date: now.toLocaleString(),
    answer: null
  };

  try {
    const questions = JSON.parse(localStorage.getItem('gaming-questions')) || [];
    questions.push(question);
    localStorage.setItem('gaming-questions', JSON.stringify(questions));
    document.getElementById('question-text').value = '';
    loadQuestions();
  } catch (error) {
    console.error('Błąd zapisu do localStorage:', error);
  }
}

// ================== Muzyka ==================
window.playPause = function(index) {
  const audio = document.getElementById(`audio-${index}`);
  const button = document.querySelector(`#player-${index} button`);

  if (audio.paused) {
    document.querySelectorAll('audio').forEach(a => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
      }
    });

    audio.play();
    button.textContent = 'Pauza';
  } else {
    audio.pause();
    button.textContent = 'Odtwarzaj';
  }
};

window.stopTrack = function(index) {
  const audio = document.getElementById(`audio-${index}`);
  const button = document.querySelector(`#player-${index} button`);

  audio.pause();
  audio.currentTime = 0;
  button.textContent = 'Odtwarzaj';
};

// ================== Dane ==================
const games = {
  // tylko kilka kategorii testowo – można dodać resztę
  online: [
    { name:"Apex Legends", released:"2025-03-10", rating:9.1 },
    { name:"Fortnite 2025", released:"2025-01-20", rating:8.9 }
  ],
  fanart: [
    { name: "KNIGHT ", img: "https://w0.peakpx.com/wallpaper/645/355/HD-wallpaper-fanart-hollow-knight-hollow-knight-games-artstation.jpg" }
  ],
  music: [
    { title: "🎮 Epic Gaming Mix ", file: "music/BATTLE.mp3" }
  ]
};

// ================== Eventy DOM ==================
document.addEventListener('DOMContentLoaded', function () {
  // Kategorie gier
  document.querySelectorAll('nav a').forEach(link => {
    if(link.dataset.cat) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        const category = link.dataset.cat;
        if (!games[category]) return;

        let html = `<h2>Top 10 gier: ${link.textContent}</h2><ol>`;
        games[category].forEach(game => {
          html += `
            <li>
              <a href="https://www.google.com/search?q=${encodeURIComponent(game.name)}" target="_blank">
                ${game.name}
              </a>
              (${game.released}) — ocena ${game.rating}
            </li>`;
        });
        main.innerHTML = html + '</ol>';
      });
    }
  });

  // FanArt
  document.getElementById('fanart-link').addEventListener('click', (e) => {
    e.preventDefault();
    let html = `<h2>FanArt</h2><div class="fanart-container">`;

    games.fanart.forEach(item => {
      html += `
        <div class="fanart-item">
          <img src="${item.img}" alt="${item.name}" class="fanart-img">
          <p>${item.name}</p>
        </div>`;
    });

    main.innerHTML = html + `</div>
      <div id="modal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modal-img">
      </div>`;

    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.fanart-img').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
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

  // Muzyka
  document.getElementById('music-link').addEventListener('click', (e) => {
    e.preventDefault();
    let html = `<h2>Gaming Music</h2>`;

    games.music.forEach((item, index) => {
      html += `
        <div class="music-player" id="player-${index}">
          <h3>${item.title}</h3>
          <audio id="audio-${index}" src="${item.file}" controls></audio>
          <div class="music-controls">
            <button onclick="playPause(${index})">Odtwarzaj</button>
            <button onclick="stopTrack(${index})">Stop</button>
            <div class="progress-container">
              <progress id="progress-${index}" value="0" max="100"></progress>
            </div>
            <span id="time-${index}">0:00</span>
          </div>
        </div>`;
    });

    main.innerHTML = html;

    games.music.forEach((_, index) => {
      const audio = document.getElementById(`audio-${index}`);
      const progress = document.getElementById(`progress-${index}`);
      const timeDisplay = document.getElementById(`time-${index}`);

      if (audio) {
        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.value = progressPercent;

            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            timeDisplay.textContent = \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;
          }
        });
      }
    });
  });

  // Zadaj Pytanie
  document.getElementById('question-link').addEventListener('click', function (e) {
    e.preventDefault();

    main.innerHTML = \`
      <h2>Zadaj Pytanie</h2>
      <div class="question-form">
        <textarea id="question-text" placeholder="Wpisz swoje pytanie tutaj..."></textarea>
        <button id="submit-question-btn">Wyślij pytanie</button>
      </div>
      <div class="question-list" id="questions-container">
        <h3>Najnowsze pytania</h3>
      </div>\`;

    document.getElementById('submit-question-btn').addEventListener('click', submitQuestion);
    loadQuestions();
  });
});
