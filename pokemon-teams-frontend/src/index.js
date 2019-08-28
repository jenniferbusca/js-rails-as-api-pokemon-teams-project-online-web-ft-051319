const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const pokemonTrainers = document.getElementById('pokemon-trainers')
const headersObj = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}

fetch(TRAINERS_URL)
  .then(response => response.json()) //arrow functions: see notes at bottom
  .then((trainersJSON) => {
    let trainersArray = trainersJSON.data;
    addTrainersToDOM(trainersArray)
  })

function addTrainersToDOM(trainersArray) {
  trainersArray.forEach(trainer => {
    fetch(`${TRAINERS_URL}/${trainer.id}`)
      .then(response => response.json())
      .then(trainer => {
          pokemonTrainers.innerHTML += `
            <div class="card" data-id="${trainer.data.id}">
              <p>${trainer.data.attributes.name}</p>
              <button class="add" data-trainer-id="${trainer.data.id}">Add Pokemon</button>
              <ul id="pokemon-list-${trainer.data.id}">
              ${renderPokemon(trainer.included)}
              </ul>
            </div>`
        })
    })
  }

function renderPokemon(array){
  return array.map(function(pokemon){
    return (`<li data-pokemon-li-id="${pokemon.id}" >${pokemon.attributes.nickname} (${pokemon.attributes.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`)
  }).join("")
}

pokemonTrainers.addEventListener('click', handleClick)

function handleClick(event) {
  if(event.target.className == "add"){
    //Step 1: Save trainer_id to a variable
    let trainerId = event.target.dataset.trainerId
    //Step 2: Make POST request
    fetch(`${POKEMONS_URL}`, {
      method: "POST",
      headers: headersObj,
      body: JSON.stringify({
        trainer_id: trainerId
      })
    })
    .then(response => response.json())
    .then(newPoke => {
      //Step 3: Update DOM
      let list = document.querySelector(`#pokemon-list-${newPoke.data.attributes.trainer_id}`)
      list.innerHTML += `<li data-pokemon-li-id="${newPoke.data.id}" >${newPoke.data.attributes.nickname} (${newPoke.data.attributes.species}) <button class="release" data-pokemon-id="${newPoke.data.id}">Release</button></li>`
    })
  } else if (event.target.className == "release"){
    //STEP BY STEP
    //1.Set the pokemon id in the dataset of the button equal to a variable
    let pokemonId = event.target.dataset.pokemonId
    //2. Make a delete request to the backend to delete the pokemon
    fetch(`${POKEMONS_URL}/${pokemonId}`, {
      method: "DELETE",
      headers: headersObj
    })
    .then(response => response.json())
    .then(deletedPokemon => {
      let list = document.querySelector(`#pokemon-list-${deletedPokemon.trainer_id}`)
      let pokemon = document.querySelector(`[data-pokemon-li-id="${deletedPokemon.id}"]`)
      //3. Update the UL Dom list to reflect removal
      pokemon.parentNode.removeChild(pokemon)
      })
  }
}
