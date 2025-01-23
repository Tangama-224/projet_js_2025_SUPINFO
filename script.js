const url_API = "https://www.omdbapi.com/";
const cle_API = "c79e3cf0";

const conteneur_films = document.querySelector(".grille_film");
const bouton_charger = document.querySelector("#charger");
let page_actuelle = 1;

async function recuperer_films(parametres_requete) {
  try {
    const reponse = await fetch(`${url_API}?apikey=${cle_API}&${parametres_requete}`);
    const donnees = await reponse.json();
    if (donnees.Response === "True") {
      return donnees.Search || [];
    } else {
      console.error(donnees.Error);
      return [];
    }
  } catch (erreur) {
    console.error("Erreur lors de la requête API :", erreur);
    return [];
  }
}

function creer_carte_film(film) {
  const article = document.createElement("article");
  article.classList.add("grille");
  article.innerHTML = `
    <img src="${film.Poster !== "N/A" ? film.Poster : "./2024.jpg"}" alt="${film.Title}">
    <h3>${film.Title}</h3>
    <p>Année : ${film.Year}</p>
    <a href="movie.html?id=${film.imdbID}" target="_blank">En savoir plus</a>
  `;
  return article;
}

async function charger_films_tendance(page = 1) {
  const films = await recuperer_films(`s=2024&page=${page}`);
  if (films.length) {
    films.forEach((film) => {
      const carte_film = creer_carte_film(film);
      conteneur_films.appendChild(carte_film);
    });
  } else {
    bouton_charger.disabled = true;
    bouton_charger.textContent = "Plus de films disponibles.";
  }
}

bouton_charger.addEventListener("click", () => {
  page_actuelle++;
  charger_films_tendance(page_actuelle);
});

document.addEventListener("DOMContentLoaded", () => {
  charger_films_tendance();
});

window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('transparent');
  } else {
    navbar.classList.remove('transparent');
  }
});