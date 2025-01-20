const cleApi = "c79e3cf0";

// Sélection des éléments DOM
const champ_Recherche = document.getElementById("entre-recherche");
const resultat_Div = document.getElementById("resultat");
const bouton_Charger = document.getElementById("charger");

// Variables pour gérer la pagination
let pageActuelle = 1;
let termeRecherche = "";

// Fonction pour rechercher des films
const rechercherFilms = async (terme, page = 1) => {
    try {
        const url = `https://www.omdbapi.com/?apikey=${cleApi}&s=${encodeURIComponent(terme)}&page=${page}`;
        const reponse = await fetch(url);
        const donnees = await reponse.json();

        // Si des films sont trouvés, les afficher
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

            // Afficher le bouton "Charger plus de résultats" si d'autres pages existent
            bouton_Charger.style.display = donnees.Search.length >= 10 ? "block" : "none";
        } else {
            // Si aucun film n'est trouvé
            if (page === 1) {
                resultat_Div.innerHTML = `<p class="message-erreur">${donnees.Error}</p>`;
                bouton_Charger.style.display = "none";
            }
        }
    } catch (erreur) {
        resultat_Div.innerHTML = `<p class="message-erreur">Une erreur est survenue. Veuillez réessayer.</p>`;
    }
};

// Gestion de la recherche en temps réel
champ_Recherche.addEventListener("input", () => {
    const terme = champ_Recherche.value.trim();

    // Si l'utilisateur entre un texte valide
    if (terme && terme !== termeRecherche) {
        termeRecherche = terme;
        pageActuelle = 1;
        resultat_Div.innerHTML = ""; // Réinitialiser les résultats
        rechercherFilms(terme); // Lancer la recherche
    } else if (!terme) {
        // Si le champ est vide, réinitialiser tout
        termeRecherche = "";
        resultat_Div.innerHTML = "";
        bouton_Charger.style.display = "none";
    }
});

// Gestion du bouton "Charger plus de résultats"
bouton_Charger.addEventListener("click", () => {
    pageActuelle++;
    rechercherFilms(termeRecherche, pageActuelle);
});
