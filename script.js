const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2306-FTB-ET-WEB-AM';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch (`${APIURL}/players`);
        const players = await response.json();
        console.log(players)
        return players;

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch (`${APIURL}/players/PLAYER-ID`);
        const playerId = await response.json();
        console.log(playerId)
        return playerId;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    let html =  
` <h1> Selected Puppy: </h1>
<div class="selected-pup-display">
    <img id="pup-selected-img" src="${obj.imageUrl}" />
      <h3>Name: ${obj.name}</h3>

      <h3>Pup ID: ${obj.id}</h3>

      <h3>Bench Status: ${obj.status}</h3>
</div>`
    let selectedPlayerElement = document.getElementById("selected-player-content")
selectedPlayerElement.innerHTML = html
selectedPlayer = playerObj

let button = document.createElement("button")

  if (currentRoster.includes(playerObj)) {
    // display remove button
      button.innerText = "Remove from Roster"
      button.onclick = () => {
        removeFromCurrentRoster(playerObj);
      }
    console.log("We found pup in roster")
  } else {
    button.innerText = "Add to Roster"
    console.log("We did not find pup in roster")
      button.onclick = () => {
        addToCurrentRoster(playerObj);
      }
  }
  selectedPlayerElement.appendChild(button)

};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch (`${APIURL}/${playerId}`, {
            method: "DELETE",
        });
        const players = await response.json();
        console.log(players)
        fetchAllPlayers();

        //  ****** RELOAD THE WINDOW *******
        window.location.reload();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.data.players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player');
            playerElement.innerHTML = `
                <h2>${player.name}</h2>
                <p>${player.breed}</p>
                <img class="puppyPic" src=${player.imageUrl}>
                <button class="details-button" id="buttons" data-id="${player.id}">See Details</button>
                <button class="remove-button" id="buttons" data-id="${player.id}">Remove From Roster</button>
                `     
                playerContainer.appendChild(playerElement);
                
            const detailsButton = playerElement.querySelector('.details-button');
            detailsButton.addEventListener('click', async (event) => {
            event.preventDefault();
            playerContainer.innerHTML = `
                <h2>${player.name}</h2>
                <p>Player ID: ${player.id}</p>
                <p>Team: ${player.teamId}</p>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <img class="puppyPic" src=${player.imageUrl}></img>
                <button class="return-button" id="buttons">Return to Roster</button>
            `;

            const returnButton = playerContainer.querySelector('.return-button');
            returnButton.addEventListener('click', () => {
                event.preventDefault();
                playerElement.remove();
                init();
            })
         });
        });       
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        let formHTML =
        /* html */
        `<form>
          <label for="Name">Name:</label>
          <input type="text" id="Name" name="Name" placeholder="Name:"/>
    
          <label for="Breed">Breed:</label>
          <input type="text" id="Breed" name="Breed" placeholder="Breed:"/>
    
          <label for="imageUrl">Image:</label>
          <input type="text" id="imageUrl" name="imageUrl" placeholder="Image URL:"/>

          <button type="submit" id="buttons">Create</button>
        </form>`;
      newPlayerFormContainer.innerHTML = formHTML;
      // add event listener
    
      let form = newPlayerFormContainer.querySelector("form");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        let playerData = {
            name: form.name,
            breed: form.breed,
            imageUrl: form.imageUrl,
        };
           
        await addNewPlayer(
          playerData.name,
          playerData.breed,
          playerData.imageUrl
        );
    
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    
        form.name = "";
        form.breed = "";
        form.imageUrl = "";
      });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();