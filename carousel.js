const apiKey = "c79e3cf0";
const carouselTrack = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");

let currentIndex = 0;

// Fonction pour récupérer les films tendances
const fetchTrendingMovies = async () => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=action&page=1`);
        const data = await response.json();

        if (data.Response === "True") {
            const movies = data.Search.slice(0, 7); // Sélectionne les 7 premiers films
            populateCarousel(movies);
            startAutoScroll(); // Démarre le défilement automatique après le chargement
        } else {
            console.error("Erreur : Aucun film trouvé");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
    }
};

// Fonction pour remplir le carousel avec les films
const populateCarousel = (movies) => {
    movies.forEach((movie) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <a href="movie.html?id=${movie.imdbID}"><img src="${movie.Poster !== "N/A" ? movie.Poster : "./placeholder.jpg"}" alt="${movie.Title}"></a>
        `;
        carouselTrack.appendChild(listItem);
    });

    // Clonage pour la boucle infinie
    const firstClone = carouselTrack.children[0].cloneNode(true);
    const lastClone = carouselTrack.children[carouselTrack.children.length - 1].cloneNode(true);

    carouselTrack.appendChild(firstClone);
    carouselTrack.insertBefore(lastClone, carouselTrack.children[0]);

    carouselTrack.style.transform = `translateX(-500px)`; // Centre le premier élément réel
};

// Fonction pour déplacer le carousel
const moveToSlide = (index) => {
    const totalSlides = carouselTrack.children.length - 2; // Sans les clones
    if (index < 0) {
        currentIndex = totalSlides - 1;
        carouselTrack.style.transition = "none";
        carouselTrack.style.transform = `translateX(-${totalSlides * 500}px)`;
        setTimeout(() => {
            carouselTrack.style.transition = "transform 0.5s ease-in-out";
            moveToSlide(currentIndex);
        });
    } else if (index >= totalSlides) {
        currentIndex = 0;
        carouselTrack.style.transition = "none";
        carouselTrack.style.transform = "translateX(-500px)";
        setTimeout(() => {
            carouselTrack.style.transition = "transform 0.5s ease-in-out";
            moveToSlide(currentIndex);
        });
    } else {
        carouselTrack.style.transform = `translateX(-${(index + 1) * 500}px)`; // Décalage avec le clone
        currentIndex = index;
    }
};

// Gestion des boutons de navigation
prevButton.addEventListener("click", () => moveToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => moveToSlide(currentIndex + 1));

// Défilement automatique
let autoScrollInterval;
const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => moveToSlide(currentIndex + 1), 3000);
};

const stopAutoScroll = () => clearInterval(autoScrollInterval);

// Pause au survol
carouselTrack.addEventListener("mouseover", stopAutoScroll);
carouselTrack.addEventListener("mouseout", startAutoScroll);

// Appel initial pour charger les films tendances
fetchTrendingMovies();
