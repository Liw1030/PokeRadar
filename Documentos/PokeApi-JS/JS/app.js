// Variable global para almacenar la lista de Pokémon
let allPokemonData = [];
const pageSize = 25; // Número de Pokémon por página
let currentPage = 1;

//* Con esto puedo usar la navbar en mi index
fetch('Components/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav').innerHTML = data;

        // Lógica de búsqueda en tiempo real
        const searchBox = document.getElementById("searchBox");
        const listaItems = document.getElementById('listaItems');
        const paginationContainer = document.getElementById('pagination-container');

        if (searchBox && listaItems) {
            searchBox.addEventListener('keyup', () => {
                const searchTerm = searchBox.value.toLowerCase();
                if (searchTerm.length > 0) {
                    // Si hay un término de búsqueda, filtramos la lista completa
                    const filteredPokemon = allPokemonData.filter(pokemon =>
                        pokemon.name.startsWith(searchTerm)
                    );
                    displayPokemon(1, filteredPokemon); // Mostramos los resultados filtrados
                    paginationContainer.style.display = 'none'; // Oculta los botones de paginación
                } else {
                    // Si no hay búsqueda, volvemos a la paginación normal
                    displayPokemon(currentPage);
                    paginationContainer.style.display = 'flex'; // Muestra los botones
                }
            });
        }

        // Lógica de paginación
        const btnSiguiente = document.getElementById('btn-siguiente');
        const btnAnterior = document.getElementById('btn-anterior');

        btnSiguiente.addEventListener('click', () => {
            const totalPages = Math.ceil(allPokemonData.length / pageSize);
            if (currentPage < totalPages) {
                currentPage++;
                displayPokemon(currentPage);
            }
        });

        btnAnterior.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPokemon(currentPage);
            }
        });
    });

//* Con esto puedo usar el footer en mi index
fetch('Components/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

// Función para mostrar los Pokémon de la página actual o los resultados de búsqueda
const displayPokemon = (page, pokemonList = allPokemonData) => {
    const listaItems = document.getElementById('listaItems');
    listaItems.innerHTML = '';
    
    // Si la lista de Pokémon no es la lista completa (es decir, es un resultado de búsqueda),
    // muestra todos los resultados. Si es la lista completa, aplica paginación.
    const itemsToDisplay = (pokemonList === allPokemonData) 
        ? pokemonList.slice((page - 1) * pageSize, page * pageSize) 
        : pokemonList;

    // Aquí es donde creamos y mostramos las tarjetas de Pokémon
    itemsToDisplay.forEach(pokemon => {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'card m-2 shadow border-radius';
        pokemonCard.style.width = '12rem';

        const nombre = pokemon.name;
        const imagen = pokemon.sprites.front_default;
        const habilidad = pokemon.abilities[0]?.ability.name || 'N/A';
        const ataque = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 'N/A';
        
        const botonFavorito = document.createElement('button');
        botonFavorito.className = 'btn btn-outline-success';
        botonFavorito.textContent = 'Favorito';
        botonFavorito.style.background = "#D90429";

        botonFavorito.addEventListener('click', function() {
            let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
            if (!favoritos.includes(nombre)) {
                favoritos.push(nombre);
                localStorage.setItem('favoritos', JSON.stringify(favoritos));
                Swal.fire({
                    title: "Agregado a favoritos!",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: "#2B2D42"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Ya está en favoritos",
                    confirmButtonColor: "#D90429"
                });
            }
        });

        pokemonCard.innerHTML = `
            <img src="${imagen}" class="card-img-top" alt="Imagen de ${nombre}">
            <div class="card-body">
                <h5 class="card-title text-capitalize text-center">${nombre}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Habilidad: ${habilidad}</li>
                <li class="list-group-item">Ataque: ${ataque}</li>
            </ul>
            <div class="card-body text-center"></div>
        `;
        pokemonCard.querySelector('.card-body.text-center').appendChild(botonFavorito);
        listaItems.appendChild(pokemonCard);
    });
};

//* Cargar todos los Pokémon al inicio
fetch('https://pokeapi.co/api/v2/pokemon?limit=1500') // Aumentamos el límite para buscar en más Pokémon
    .then(response => response.json())
    .then(data => {
        const promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        
        Promise.all(promises)
            .then(pokemonDataArray => {
                allPokemonData = pokemonDataArray;
                displayPokemon(currentPage); // Muestra la primera página al cargar
            });
    })
    .catch(error => console.error('Error al cargar Pokémon:', error));