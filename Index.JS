window.addEventListener('load', () => {
  // Laisse le temps à l'animation de finir avant de passer à l'intro
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('intro').classList.remove('hidden');
  }, 2500);
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#continue-watching') {
    document.body.style.overflow = 'auto'; // autorise le scroll
  } else {
    document.body.style.overflow = 'hidden'; // empêche le scroll
  }
});

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#continue-watching') {
    document.body.style.overflow = 'auto'; // autorise le scroll
  } else {
    document.body.style.overflow = 'hidden'; // empêche le scroll
  }
});

function showEmail() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('emailPage').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('emailPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
}

function showProfiles() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
}

// Exemple : lancer la page de login après email (ou modifier ton bouton GET STARTED pour ça)
document.querySelector('#emailPage button').addEventListener('click', showLogin);

// Exemple : simuler login réussi
document.querySelector('#loginPage button').addEventListener('click', showProfiles);

document.addEventListener('DOMContentLoaded', function () {
  const signInButton = document.querySelector('#loginPage button');
  const loginPage = document.getElementById('loginPage');
  const dashboardPage = document.getElementById('dashboardPage');

  signInButton.addEventListener('click', function () {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
  });
});

document.querySelector('#loginPage button').addEventListener('click', () => {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('homePage').classList.remove('hidden');
});

let currentFilmIndex = 0;
const films = document.querySelectorAll('#heroBanner img');
const totalFilms = films.length;

function changeFilm() {
  // Masquer le film actuel
  films[currentFilmIndex].classList.add('opacity-0');

  // Passer au film suivant
  currentFilmIndex = (currentFilmIndex + 1) % totalFilms;

  // Afficher le film suivant
  films[currentFilmIndex].classList.remove('opacity-0');
}

setInterval(changeFilm, 5000); // Changer toutes les 5 secondes

document.addEventListener('DOMContentLoaded', () => {
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const createFilmElement = (film, index, liste, updateCallback) => {
    const li = document.createElement('li');
    li.classList.add('flex', 'justify-between', 'items-center', 'mb-2');

    const titre = document.createElement('span');
    titre.textContent = film.titre;

    const btnSuppr = document.createElement('button');
    btnSuppr.textContent = 'Supprimer';
    btnSuppr.className = 'text-red-500 hover:text-red-700 text-sm';
    btnSuppr.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast("Vous devez être connecté pour supprimer un film.", "error");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/rentals/return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rental_id: film.id })
        });

        if (response.ok) {
          liste.splice(index, 1);
          localStorage.setItem("filmsLoues", JSON.stringify(liste));
          updateCallback(); // Mettre à jour l'interface
          showToast("Film retourné avec succès !", "success");
        } else {
          const data = await response.json();
          showToast(`Erreur : ${data.message}`, "error");
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du film:', error);
        showToast("Une erreur est survenue lors du retour du film.", "error");
      }
    });

    li.appendChild(titre);
    li.appendChild(btnSuppr);
    return li;
  };








  // Louer un film 

  
  const updateMaListeHeader = () => {
    const liste = JSON.parse(localStorage.getItem("filmsLoues")) || [];

    // 🎯 Menu PC
    const headerListe = document.getElementById('ma-liste-menu-dropdown');
    if (headerListe) {
      headerListe.innerHTML = '';
      liste.forEach((film, index) => {
        const li = createFilmElement(film, index, liste, updateMaListeHeader);
        headerListe.appendChild(li);
      });
    }

    // 📱 Menu Mobile
    const mobileListe = document.getElementById('listeFilms');
    const compteur = document.getElementById('listeCount');
    if (mobileListe && compteur) {
      mobileListe.innerHTML = '';
      compteur.textContent = `(${liste.length})`;
      liste.forEach((film, index) => {
        const li = createFilmElement(film, index, liste, updateMaListeHeader);
        mobileListe.appendChild(li);
      });
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  };

  document.addEventListener('click', async (e) => {
    const button = e.target.closest('button[data-film-id]');
    if (!button) return;

    const filmId = button.getAttribute('data-film-id');
    const token = localStorage.getItem('token');

    if (!token) {
      showToast("Vous devez être connecté pour louer un film.", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rentals/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ film_id: filmId })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('🎉 Film loué avec succès !', 'success');

        document.querySelectorAll(`button[data-film-id="${filmId}"]`).forEach(btn => {
          btn.textContent = "Visionner";
          btn.disabled = true;
        });

        const modal = button.closest('.fixed');
        if (modal) closeModal(modal.id);

        const filmCard = button.closest('.film-card');
        const film = {
          id: filmId,
          titre: filmCard?.querySelector('h2')?.textContent || 'Film inconnu',
          description: filmCard?.querySelector('p.text-gray-400')?.textContent || '',
          image: filmCard?.querySelector('img')?.getAttribute('src') || '',
          annee: filmCard?.getAttribute('data-annee') || '2023',
          duree: filmCard?.getAttribute('data-duree') || '1h42',
          genre: filmCard?.getAttribute('data-genre') || 'Drame'
        };

        let liste = JSON.parse(localStorage.getItem("filmsLoues")) || [];
        if (!liste.some(f => f.id === film.id)) {
          liste.push(film);
          localStorage.setItem("filmsLoues", JSON.stringify(liste));
        }

        updateMaListeHeader();
      } else {
        showToast(`❌ ${data.message}`, 'error');
      }
    } catch (error) {
      console.error('Erreur location:', error);
      showToast("🚨 Une erreur est survenue.", "error");
    }
  });

  updateMaListeHeader();
});
