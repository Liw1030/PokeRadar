//* Con esto puedo usar la navbar en mi index
fetch('/Components/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav').innerHTML = data
    })


// Variables para controlar el juego
const pokemonImage = document.getElementById('pokemon-image');
const guessInput = document.getElementById('guess-input');
const guessForm = document.getElementById('guess-form');
const playAgainBtn = document.getElementById('play-again-btn');
const messageContainer = document.getElementById('message-container');

let correctPokemon; // Aquí guardaremos el Pokémon a adivinar
let guessCount; // Nuevo contador de intentos

// Función principal para inicializar el juego
const initGame = async () => {
    try {
        // Obtenemos una lista de 150 Pokémon de la PokeAPI
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        const pokemonList = data.results;

        // Elegimos un Pokémon aleatorio
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        const randomPokemon = pokemonList[randomIndex];

        // Obtenemos los datos completos del Pokémon (incluida la imagen)
        const pokemonResponse = await fetch(randomPokemon.url);
        const pokemonData = await pokemonResponse.json();

        correctPokemon = pokemonData;

        // Reiniciar el contador de intentos
        guessCount = 0;

        // Limpiamos los elementos del juego y preparamos la imagen
        pokemonImage.classList.remove('silhouette'); 
        guessInput.value = '';
        guessInput.disabled = false;
        guessForm.style.display = 'block';
        playAgainBtn.classList.add('d-none');
        messageContainer.innerHTML = '';
        
        pokemonImage.onload = () => {
            pokemonImage.classList.add('silhouette');
            guessInput.focus();
        };
        pokemonImage.src = correctPokemon.sprites.front_default;

        console.log("Pokémon a adivinar:", correctPokemon.name);
    } catch (error) {
        console.error("Error al cargar el Pokémon:", error);
        messageContainer.innerHTML = `<p class="text-danger">Error al cargar el juego. Intenta de nuevo.</p>`;
    }
};

// Función para verificar la adivinanza
const checkGuess = (e) => {
    e.preventDefault();
    const userGuess = guessInput.value.toLowerCase();
    const correctName = correctPokemon.name.toLowerCase();

    if (userGuess === correctName) {
        pokemonImage.classList.remove('silhouette');
        guessForm.style.display = 'none';
        playAgainBtn.classList.remove('d-none');
        Swal.fire({
            title: "¡Correcto!",
            text: `¡Adivinaste, es ${correctPokemon.name}!`,
            icon: "success",
            confirmButtonColor: "#2B2D42"
        });
    } else {
        guessCount++;
        if (guessCount < 3) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Inténtalo de nuevo, ese no es. Te quedan ${3 - guessCount} intentos.`,
                confirmButtonColor: "#D90429"
            });
        } else {
            pokemonImage.classList.remove('silhouette');
            guessForm.style.display = 'none';
            playAgainBtn.classList.remove('d-none');
            Swal.fire({
                title: "¡Se te acabaron los intentos!",
                text: `El Pokémon es ${correctPokemon.name}.`,
                icon: "info",
                confirmButtonColor: "#D90429"
            });
        }
    }
};

// Función para mostrar la alerta de reglas
const showRulesAlert = () => {
    Swal.fire({
        title: "¿Quién es ese Pokémon?",
        html: `
            <p><strong>Reglas del juego:</strong></p>
            <ul>
                <li>Adivina el nombre del Pokémon por su silueta.</li>
                <li>Tienes <strong>3 intentos</strong> para adivinar.</li>
                <li>Si fallas los 3 intentos, se revelará el nombre y la imagen.</li>
            </ul>
        `,
        icon: "info",
        confirmButtonText: "¡Jugar!",
        confirmButtonColor: "#3085d6",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(() => {
        initGame(); // Inicia el juego solo después de que el usuario presione el botón
    });
};

// Asignar eventos
guessForm.addEventListener('submit', checkGuess);
playAgainBtn.addEventListener('click', initGame);

// Iniciar el juego mostrando la alerta de reglas
document.addEventListener('DOMContentLoaded', showRulesAlert);