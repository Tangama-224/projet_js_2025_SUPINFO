const cle_api = "c79e3cf0";
const piste_carrousel = document.querySelector(".carrousel_liste");
const bouton_precedent = document.querySelector(".carrousel_prec");
const bouton_suivant = document.querySelector(".carrousel_suiv");

let index_actuel = 0;

const recuperer_films_tendance = async () => {
    try {
        const reponse = await fetch(`https://www.omdbapi.com/?apikey=${cle_api}&s=action&page=1`);
        const donnees = await reponse.json();

        if (donnees.Response === "True") {
            const films = donnees.Search.slice(0, 7);
            remplir_carrousel(films);
            demarrer_defilement_auto();
        } else {
            console.error("Erreur : Aucun film trouvé");
        }
    } catch (erreur) {
        console.error("Erreur lors de la récupération des films :", erreur);
    }
};

const remplir_carrousel = (films) => {
    films.forEach((film) => {
        const element_liste = document.createElement("li");
        element_liste.innerHTML = `
            <a href="movie.html?id=${film.imdbID}"><img src="${film.Poster !== "N/A" ? film.Poster : "./placeholder.jpg"}" alt="${film.Title}"></a>
        `;
        piste_carrousel.appendChild(element_liste);
    });

    const premier_clone = piste_carrousel.children[0].cloneNode(true);
    const dernier_clone = piste_carrousel.children[piste_carrousel.children.length - 1].cloneNode(true);

    piste_carrousel.appendChild(premier_clone);
    piste_carrousel.insertBefore(dernier_clone, piste_carrousel.children[0]);

    piste_carrousel.style.transform = `translateX(-500px)`;
};

const deplacer_vers_diapositive = (index) => {
    const total_diapositives = piste_carrousel.children.length - 2;
    if (index < 0) {
        index_actuel = total_diapositives - 1;
        piste_carrousel.style.transition = "none";
        piste_carrousel.style.transform = `translateX(-${total_diapositives * 500}px)`;
        setTimeout(() => {
            piste_carrousel.style.transition = "transform 0.5s ease-in-out";
            deplacer_vers_diapositive(index_actuel);
        });
    } else if (index >= total_diapositives) {
        index_actuel = 0;
        piste_carrousel.style.transition = "none";
        piste_carrousel.style.transform = "translateX(-500px)";
        setTimeout(() => {
            piste_carrousel.style.transition = "transform 0.5s ease-in-out";
            deplacer_vers_diapositive(index_actuel);
        });
    } else {
        piste_carrousel.style.transform = `translateX(-${(index + 1) * 500}px)`;
        index_actuel = index;
    }
};

bouton_precedent.addEventListener("click", () => deplacer_vers_diapositive(index_actuel - 1));
bouton_suivant.addEventListener("click", () => deplacer_vers_diapositive(index_actuel + 1));

let intervalle_defilement_auto;
const demarrer_defilement_auto = () => {
    intervalle_defilement_auto = setInterval(() => deplacer_vers_diapositive(index_actuel + 1), 3000);
};

const arreter_defilement_auto = () => clearInterval(intervalle_defilement_auto);

piste_carrousel.addEventListener("mouseover", arreter_defilement_auto);
piste_carrousel.addEventListener("mouseout", demarrer_defilement_auto);

recuperer_films_tendance();
