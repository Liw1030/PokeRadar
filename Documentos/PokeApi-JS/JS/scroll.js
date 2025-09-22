// let offset = 0;
// const limit = 20;
// const maxPokemons = 100;

// function cargarPokemones() {
//     console.log(`Cargando pokemones con offset: ${offset}`);

//     fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
//         .then(res => res.json())
//         .then(data => {
//             console.log("Datos recibidos:", data);
//             mostrarPokemones(data.results);

//             document.getElementById('btn-anterior').disabled = offset === 0;
//             document.getElementById('btn-siguiente').disabled = offset + limit >= maxPokemons;
//         })
//         .catch(err => console.error("Error al cargar pokemones:", err));
// }

// document.getElementById('btn-anterior').addEventListener('click', () => {
//     if (offset >= limit) {
//         offset -= limit;
//         cargarPokemones();
//     }
// });

// document.getElementById('btn-siguiente').addEventListener('click', () => {
//     if (offset + limit < maxPokemons) {
//         offset += limit;
//         cargarPokemones();
//     }
// });

// cargarPokemones();

// function mostrarPokemones(pokemones) {
//     const container = document.getElementById('listaItems');
//     container.innerHTML = '';

//     pokemones.forEach(pokemon => {
//         try {
//             const urlParts = pokemon.url.split('/').filter(Boolean);
//             const pokemonId = urlParts[urlParts.length - 1];
//             const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

//             const card = document.createElement('div');
//             card.className = 'card m-2 p-2 text-center';
//             card.style.width = '150px';

//             card.innerHTML = `
//                 <img src="${imageUrl}" alt="${pokemon.name}" class="card-img-top mx-auto" style="width: 100px;">
//                 <p class="fw-bold mt-2 text-capitalize">${pokemon.name}</p>
//                 <button class="btn btn-sm btn-outline-primary">Ver más</button>
//             `;

//             container.appendChild(card);
//         } catch (error) {
//             console.error("Error mostrando un Pokémon:", pokemon, error);
//         }
//     });
// }
