const cleApi = "c79e3cf0";

const champ_Recherche = document.getElementById("entre-recherche");
const resultat_Div = document.getElementById("resultat");
const bouton_Charger = document.getElementById("charger");


let page_Actuelle = 1;
let terme_Recherche = "";


const rechercherFilms = async (terme, page = 1) => {
  try {
    const url = `https://www.omdbapi.com/?apikey=${cleApi}&s=${encodeURIComponent(terme)}&page=${page}`;
    const reponse = await fetch(url);
    const donnees = await reponse.json();
    if (donnees.Response === "True") {
      donnees.Search.forEach((film) => {
        const carteFilm = `
          <div class="carte-film">
            <img src="${film.Poster !== "N/A" ? film.Poster : "./2024.jpg"}" alt="${film.Title}">
            <h3>${film.Title}</h3>
            <p>Année : ${film.Year}</p>
            <a href="movie.html?id=${film.imdbID}" target="_blank">Détails</a>
          </div>
        `;
        resultat_Div.innerHTML += carteFilm;
      });
      bouton_Charger.style.display = donnees.Search.length >= 10 ? "block" : "none";
    } else {
      if (page === 1) {
        resultat_Div.innerHTML = `<p class="message-erreur">${donnees.Error}</p>`;
        bouton_Charger.style.display = "none";
      }
    }
  } catch (erreur) {
    resultat_Div.innerHTML = `<p class="message-erreur">Une erreur est survenue. Veuillez réessayer.</p>`;
  }
};

champ_Recherche.addEventListener("input", () => {
  const terme = champ_Recherche.value.trim();
  if (terme && terme !== terme_Recherche) {
    terme_Recherche = terme;
    page_Actuelle = 1;
    resultat_Div.innerHTML = "";
    rechercherFilms(terme);
  } else if (!terme) {
    terme_Recherche = "";
    resultat_Div.innerHTML = "";
    bouton_Charger.style.display = "none";
  }
});

bouton_Charger.addEventListener("click", () => {
  page_Actuelle++;
  rechercherFilms(terme_Recherche, page_Actuelle);
});

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('transparent');
    } else {
      navbar.classList.remove('transparent');
    }
  });

