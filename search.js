
const apiKey = "c79e3cf0";

// Sélection des éléments DOM
const searchInput = document.getElementById("entre-recherche");
const resultsDiv = document.getElementById("resultat");
const loadMoreButton = document.getElementById("charger");

// Variables pour gérer la pagination
let currentPage = 1;
let currentSearchTerm = "";

// Fonction pour rechercher des films
const searchMovies = async (searchTerm, page = 1) => {
    try {
        const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            const moviesHTML = data.Search.map((movie) => `
                <div class="movie-card">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "./2024.jpg"}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                    <p>Année : ${movie.Year}</p>
                    <a href="movie.html?id=${movie.imdbID}" target="_blank">Détails</a>
                </div>
            `).join(""); // Utilisation de `.join("")` pour combiner les résultats

            resultsDiv.innerHTML += moviesHTML;

            loadMoreButton.style.display = data.Search.length >= 10 ? "block" : "none";
        } else {
            if (page === 1) {
                resultsDiv.innerHTML = `<p class="error-message">${data.Error}</p>`;
                loadMoreButton.style.display = "none";
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error-message">Une erreur est survenue. Veuillez réessayer.</p>`;
    }
};


// Gestion de la recherche en temps réel
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();

    // Si l'utilisateur entre un texte valide
    if (searchTerm && searchTerm !== currentSearchTerm) {
        currentSearchTerm = searchTerm;
        currentPage = 1;
        resultsDiv.innerHTML = ""; // Réinitialiser les résultats
        searchMovies(searchTerm); // Lancer la recherche
    } else if (!searchTerm) {
        // Si le champ est vide, réinitialiser tout
        currentSearchTerm = "";
        resultsDiv.innerHTML = "";
        loadMoreButton.style.display = "none";
    }
});

// Gestion du bouton "Charger plus de résultats"
loadMoreButton.addEventListener("click", () => {
    currentPage++;
    searchMovies(currentSearchTerm, currentPage);
});

// Navbar Scroll
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('transparent');
    } else {
      navbar.classList.remove('transparent');
    }
  });