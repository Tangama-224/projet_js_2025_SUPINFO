const cleApi = "c79e3cf0";

const parametresUrl = new URLSearchParams(window.location.search);
const idFilm = parametresUrl.get('id');

const titreFilm = document.getElementById('titre-film');
const afficheFilm = document.getElementById('affiche-film');
const resumeFilm = document.getElementById('resume-film');
const genresFilm = document.getElementById('genres-film');
const acteursFilm = document.getElementById('acteurs-film');
const rangFilm = document.getElementById('rang-film');
const sortieFilm = document.getElementById('sortie-film');

// Fonction pour récupérer les détails du film depuis l'API
async function recupererDetailsFilm(id) {
  try {
    const reponse = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${cleApi}`);
    if (!reponse.ok) {
      throw new Error("Erreur lors de la récupération des données.");
    }
    const donnees = await reponse.json();
    if (donnees.Response === "False") {
      throw new Error(donnees.Error);
    }
    return {
      titre: donnees.Title,
      affiche: donnees.Poster,
      resume: donnees.Plot,
      genres: donnees.Genre,
      acteurs: donnees.Actors.split(", "),
      rang: donnees.imdbRating,
      sortieDvd: donnees.DVD,
    };
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
    alert("Impossible de charger les détails du film. Vérifiez l'identifiant ou réessayez plus tard.");
  }
}

// Charger les détails du film et les insérer dans le DOM
async function chargerDetailsFilm() {
  if (!idFilm) {
    alert("Aucun identifiant de film spécifié.");
    return;
  }
  const film = await recupererDetailsFilm(idFilm);
  if (film) {
    titreFilm.textContent = film.titre;
    afficheFilm.src = film.affiche !== "N/A" ? film.affiche : "./2024.jpg";
    afficheFilm.alt = `Affiche de ${film.titre}`;
    resumeFilm.textContent = film.resume;
    genresFilm.textContent = film.genres;
    acteursFilm.textContent = film.acteurs.join(', ');
    rangFilm.textContent = film.rang || "N/A";
    sortieFilm.textContent = film.sortieDvd ? new Date(film.sortieDvd).toLocaleDateString('fr-FR') : "Non disponible";
  }
}

chargerDetailsFilm();
