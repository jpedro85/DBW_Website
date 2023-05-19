/**
 * This functions returns a timestamp in dd-mm-yyyy hh:mm format
 * @returns {String}
 */
function formatDate() {
  // Formatting the display of the time
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${day} - ${month} - ${year} ${hours}:${minutes}`;
}
/**
 * This function returns the playerAnswer in formatted html that's going inside a div
 * @param {Object} playerAnswer This object is contains the needed data to format the answer
 * @param {String} playerAnswer.username The use'r/player's username
 * @param {String} playerAnswer.message The user's/player's answer
 * @param {String} playerAnswer.timeStamp The user's/player's timeStamp of when it was sent
 * @returns 
 */
function formatAnswer(playerAnswer) {
  let formattedAnswer = `
        <div class="tab-game-item-fotoNome">
            <div class="tab-item-sethings-playersInMatch-item-mask" style='background-image: url("/images/Logo-Inactive.png");'></div>
            <div class="tab-game-item-dateTime-text">
                <div class="tab-game-item-name-text tab-item-sethings-playersInMatch-item-name">${playerAnswer.username}</div> <!-- max name lenght 25 -->
                <div>${playerAnswer.timeStamp}</div>
            </div>
        </div>
        <div class="tab-game-item-conteinertext tab-game-item-text">
            <div>Tried:</div>
            <div>${playerAnswer.message} </div>
        </div>`;
  return formattedAnswer;
}

/**
 * This function uses DOM to write the answer on the GameTab
 * @param {Object} playerAnswer This object is contains the needed data to format the answer
 * @param {String} playerAnswer.username The use'r/player's username
 * @param {String} playerAnswer.message The user's/player's answer
 * @param {String} playerAnswer.timeStamp The user's/player's timeStamp of when it was sent
 */
function sendAnswer(playerAnswer) {
    
    // Creates a new div
    const newAnswer = document.createElement("div");
    newAnswer.classList.add("tab-game-item-name-conteiner", `tab-game-item-dateTime-conteiner-${playerAnswer.status}`);

    // Adds dynamic html to the new div
    newAnswer.innerHTML =formatAnswer(playerAnswer);

    // Adds the comment onto the page
    gameChat.appendChild(newAnswer);
}