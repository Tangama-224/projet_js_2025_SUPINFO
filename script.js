const API_URL = "https://www.omdbapi.com/";

// Ta clé API
const API_KEY = "c79e3cf0"; // Assure-toi que cette clé reste confidentielle

// Sélection de l'élément HTML contenant la grille des films
const moviesContainer = document.querySelector(".grille_film");

// Sélection du bouton "Charger plus de films"
const loadMoreButton = document.querySelector("#charger");

// Variable pour suivre la pagination des résultats
let currentPage = 1;

// === FONCTIONS UTILES ===

// Fonction pour effectuer une requête vers l'API OMDb
async function fetchMovies(queryParams) {
  try {
    // Construire l'URL de la requête avec les paramètres fournis
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&${queryParams}`);

    // Convertir la réponse en JSON
    const data = await response.json();

    // Vérifier si la requête a réussi
    if (data.Response === "True") {
      return data.Search || []; // Retourner les films trouvés
    } else {
      console.error(data.Error); // Afficher l'erreur dans la console
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la requête API :", error); // Gérer les erreurs réseau
    return [];
  }
}

// Fonction pour créer dynamiquement une carte de film
function createMovieCard(movie) {
  const article = document.createElement("article"); // Créer un élément <article>
  article.classList.add("grille"); // Ajouter la classe "grille"

  // Ajouter le contenu HTML pour chaque carte de film
  article.innerHTML = `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : "./2024.jpg"}" alt="${movie.Title}">
    <h3>${movie.Title}</h3>
    <p>Année : ${movie.Year}</p>
    <a href="movie.html?id=${movie.imdbID}" target="_blank">En savoir plus</a>
  `;

  return article; // Retourner l'élément <article> généré
}

// Fonction pour charger et afficher les films tendances
async function loadTrendingMovies(page = 1) {
  // Effectuer une requête pour les films de l'année 2024 avec pagination
  const movies = await fetchMovies(`s=2024&page=${page}`);

  // Vérifier si des films ont été trouvés
  if (movies.length) {
    movies.forEach((movie) => {
      // Créer une carte pour chaque film
      const movieCard = createMovieCard(movie);
      // Ajouter la carte au conteneur des films
      moviesContainer.appendChild(movieCard);
    });
  } else {
    // Désactiver le bouton et afficher un message si aucun film n'est disponible
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Plus de films disponibles.";
  }
}

// === GESTION DES ÉVÉNEMENTS ===

// Gestionnaire pour le bouton "Charger plus de films"
loadMoreButton.addEventListener("click", () => {
  currentPage++; // Incrémenter la page courante
  loadTrendingMovies(currentPage); // Charger les films de la page suivante
});

// Charger les films dès que la page est prête
document.addEventListener("DOMContentLoaded", () => {
  loadTrendingMovies(); // Charger les films de la première page
});
