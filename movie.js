const apiKey = "c79e3cf0";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const titleElement = document.getElementById('movie-title');
const posterElement = document.getElementById('movie-poster');
const summaryElement = document.getElementById('movie-summary');
const genreElement = document.getElementById('movie-genre');
const actorsElement = document.getElementById('movie-actors');
const ratingElement = document.getElementById('movie-rating');
const dvdReleaseElement = document.getElementById('movie-dvd-release');

// Fonction pour récupérer les détails du film depuis l'API
async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }
    const data = await response.json();
    if (data.Response === "False") {
      throw new Error(data.Error);
    }
    return {
      title: data.Title,
      poster: data.Poster,
      summary: data.Plot,
      genre: data.Genre,
      actors: data.Actors.split(", "),
      rating: data.imdbRating,
      dvdRelease: data.DVD,
    };
  } catch (error) {
    console.error("Erreur :", error.message);
    alert("Impossible de charger les détails du film. Vérifiez l'identifiant ou réessayez plus tard.");
  }
}

// Charger les détails du film et les insérer dans le DOM
async function loadMovieDetails() {
  if (!movieId) {
    alert("Aucun identifiant de film spécifié.");
    return;
  }
  const movie = await fetchMovieDetails(movieId);
  if (movie) {
    titleElement.textContent = movie.title;
    posterElement.src = movie.poster !== "N/A" ? movie.poster : "placeholder.jpg";
    posterElement.alt = `Affiche de ${movie.title}`;
    summaryElement.textContent = movie.summary;
    genreElement.textContent = movie.genre;
    actorsElement.textContent = movie.actors.join(', ');
    ratingElement.textContent = movie.rating || "N/A";
    dvdReleaseElement.textContent = movie.dvdRelease ? new Date(movie.dvdRelease).toLocaleDateString('fr-FR') : "Non disponible";
  }
}

loadMovieDetails();
