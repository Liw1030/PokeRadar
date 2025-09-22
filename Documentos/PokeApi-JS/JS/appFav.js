// Variable global para almacenar la lista de Pokémon favoritos
let allFavoritePokemonData = [];
let favoritosContainer = null;

//* Con esto puedo usar la navbar
fetch('Components/navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav').innerHTML = data;

        const searchBox = document.getElementById("searchBox");
        if (searchBox) {
            searchBox.addEventListener('keyup', () => {
                const searchTerm = searchBox.value.toLowerCase();
                const filteredPokemon = allFavoritePokemonData.filter(pokemon =>
                    pokemon.name.startsWith(searchTerm)
                );
                displayFavorites(filteredPokemon);
            });
        }
    });

//* Con esto puedo usar el footer
fetch('Components/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

// Función para renderizar los Pokémon favoritos en la página
const displayFavorites = (pokemonList) => {
    if (!favoritosContainer) {
        console.error('El contenedor de favoritos no se encontró.');
        return;
    }

    favoritosContainer.innerHTML = '';
    if (pokemonList.length === 0) {
        favoritosContainer.innerHTML = '<p>No se encontraron Pokémon con ese nombre.</p>';
        return;
    }

    pokemonList.forEach(info => {
        const nombre = info.name;
        const imagen = info.sprites.front_default;
        const habilidad = info.abilities[0]?.ability.name || 'N/A';
        const ataque = info.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 'N/A';

        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'card m-2 shadow';
        pokemonCard.style.width = '12rem';

        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'btn btn-danger';
        botonEliminar.textContent = 'Eliminar';

        botonEliminar.addEventListener('click', function () {
            Swal.fire({
                title: "¿Estás seguro?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#D90429", 
                cancelButtonColor: "#2B2D42", 
                confirmButtonText: "Sí, ¡elimínalo!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
                    favoritos = favoritos.filter(poke => poke !== nombre);
                    localStorage.setItem('favoritos', JSON.stringify(favoritos));

                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "El Pokémon ha sido eliminado de tus favoritos.",
                        icon: "success",
                        confirmButtonColor: "#2B2D42"
                    });

                    // 3. Recarga la lista para que el cambio se muestre
                    loadAndDisplayFavorites();
                }
            });
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
        pokemonCard.querySelector('.card-body.text-center').appendChild(botonEliminar);
        favoritosContainer.appendChild(pokemonCard);
    });
};

// Función para cargar los Pokémon y los datos
const loadAndDisplayFavorites = () => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.length === 0) {
        favoritosContainer.innerHTML = '<p>No tienes Pokémon favoritos.</p>';
        return;
    }

    const promises = favoritos.map(nombre =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`).then(res => res.json())
    );

    Promise.all(promises)
        .then(pokemonDataArray => {
            allFavoritePokemonData = pokemonDataArray;
            displayFavorites(allFavoritePokemonData);
        })
        .catch(error => {
            console.error('Error al cargar Pokémon favoritos:', error);
            favoritosContainer.innerHTML = '<p>Ocurrió un error al cargar los Pokémon.</p>';
        });
};

document.addEventListener('DOMContentLoaded', () => {
    favoritosContainer = document.getElementById('listaItems');
    loadAndDisplayFavorites();
});