"use strict";
let numblock = 0;
// const allPokemonUrl = "https://pokeapi.co/api/v2/pokemon?limit=1050&offset=0";
const allPokemonUrl = "https://pokeapi.co/api/v2/pokemon?limit=721&offset=0";
let allPokemon = [];
let allPokemonObj = [];
let pokeRegis = 0;


const callApi = async (url) => {
    loading();
    const usuario = await fetch(url);
    let data = await usuario.json();
    loading();
    return data;

};



let callApi2 = (url) => {
    let promesa = new Promise((resolve, reject) => {

        let temp = 5000; //tiempo para activar la carga de pokemon
        if (true) {
            //número de pokemon que carga sin espera
            if (numblock >= 100) {
                setTimeout(() => {
                    numblock = 0;
                    let pok = callApi(url);
                    resolve(pok);
                }, temp);
                //número de pokemon antes de esperar
            }
            else {
                setTimeout(() => {
                    let pok = callApi(url);
                    resolve(pok);
                }, 10);

            }


        } else {
            reject('error')
        }
    });

    return promesa;
}




async function getAllPokemon() {

    try {

        const load = await callApi(allPokemonUrl);
        allPokemon = load.results;

        let pokUrl = [];
        for (let i = 0; i < allPokemon.length; i++) {
            pokeRegis++;
            const element = allPokemon[i];

            pokUrl.push(element.url);


        }

        document.getElementById('text-title').textContent = `Pokémon registrados: ${pokeRegis}`;



        for (const item of pokUrl) {
            numblock++;
            let poke = await callApi2(item);
            allPokemonObj.push(poke);
            new Print().printPokedex(poke.sprites.other['official-artwork'].front_default, poke.name);

        }




    } catch (error) {
        console.log(error);
    }

}



document.getElementsByClassName('section-pokedex')[0].addEventListener('click', (e) => {
    let nam = e.path[1].getAttribute('nombre');
    pokemon(nam);
    entrenador();
});




async function pokemon(name) {

    try {
        let poke = await callApi(`https://pokeapi.co/api/v2/pokemon/${name}`);
        let tipos = '';
        let habilidades = '';

        for (let i = 0; i < poke.types.length; i++) {
            const element = poke.types[i];
            tipos += `${element.type.name}, `;
        }
        for (let i = 0; i < poke.abilities.length; i++) {
            const element = poke.abilities[i];
            habilidades += `${element.ability.name}, `;
        }
        tipos = tipos.substring(0, tipos.length - 2);
        habilidades = habilidades.substring(0, habilidades.length - 2);
        // new Print().printPokemon(poke.sprites.front_default, poke.name, tipos, habilidades, poke.height, poke.weight);
        new Print().printPokemon(poke.sprites.other['official-artwork'].front_default, poke.name, tipos, habilidades, poke.height, poke.weight);



    } catch (error) {
        console.log(error);
    }
}


async function entrenador() {

    try {

        let entren = await callApi(`https://randomuser.me/api`);
        let entrenador = entren.results[0];

        let fecha = entrenador.dob.date;
        let direccion = `${entrenador.location.country}, ${entrenador.location.street.name}, nº ${entrenador.location.street.number}`;
        fecha = fecha.substring(0, 10);
        new Print().printEntrenador(entrenador.picture.large, entrenador.name.first, entrenador.email, fecha, entrenador.phone, direccion);

    } catch (error) {
        console.log(error);
    }
}






class Print {
    constructor() {}


    printPokedex(urlImg, nombre) {


        let div = document.createElement('div');
        div.classList.add('img-pokedex');
        var atr = document.createAttribute("nombre");
        atr.value = nombre;
        div.setAttributeNode(atr);
        let img = document.createElement('img');
        img.classList.add('img-pokedex-img');
        img.src = urlImg;
        div.appendChild(img);
        document.getElementsByClassName('section-pokedex')[0].appendChild(div);


    }

    printPokemon(urlImg, nombre, tipo, habilidad, altura, peso) {

        document.getElementById('img-pokemon').src = urlImg;
        document.getElementById('nombre-pokemon').textContent = nombre;
        document.getElementById('tipo-pokemon').textContent = tipo;
        document.getElementById('habilidad-pokemon').textContent = habilidad;
        document.getElementById('altura-pokemon').textContent = `${(Number(altura)/10)} m`;
        document.getElementById('peso-pokemon').textContent = `${(Number(peso)/10)} kg`;


    }

    printEntrenador(urlImg, nombre, email, fecha, contacto, direccion) {

        document.getElementById('img-entrenador').src = urlImg;
        document.getElementById('nombre').textContent = nombre;
        document.getElementById('email').textContent = email;
        document.getElementById('fecha').textContent = fecha;
        document.getElementById('contacto').textContent = contacto;
        document.getElementById('direccion').textContent = direccion;

    }

}




function loading() {

}


getAllPokemon();
entrenador();