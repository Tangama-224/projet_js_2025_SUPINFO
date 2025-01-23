const cle_Api = "c79e3cf0";

const parametresUrl = new URLSearchParams(window.location.search);
const idFilm = parametresUrl.get('id');

const titre_Film = document.getElementById('titre-film');
const affiche_Film = document.getElementById('affiche-film');
const resume_Film = document.getElementById('resume-film');
const genres_Film = document.getElementById('genres-film');
const acteurs_Film = document.getElementById('acteurs-film');
const rang_Film = document.getElementById('rang-film');
const sortie_Film = document.getElementById('sortie-film');


async function recupererDetailsFilm(id) {
  try {
    const reponse = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${cle_Api}`);
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

async function chargerDetailsFilm() {
  if (!idFilm) {
    alert("Aucun identifiant de film .");
    return;
  }
  const film = await recupererDetailsFilm(idFilm);
  if (film) {
    titre_Film.textContent = film.titre;
    affiche_Film.src = film.affiche !== "N/A" ? film.affiche : "./2024.jpg";
    affiche_Film.alt = `Affiche de ${film.titre}`;
    resume_Film.textContent = film.resume;
    genres_Film.textContent = film.genres;
    acteurs_Film.textContent = film.acteurs.join(', ');
    rang_Film.textContent = film.rang || "N/A";
    sortie_Film.textContent = film.sortieDvd ? new Date(film.sortieDvd).toLocaleDateString('fr-FR') : "Non disponible";
  }
}

chargerDetailsFilm();
