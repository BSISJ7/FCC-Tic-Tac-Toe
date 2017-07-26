var firstPlayerTurn = true;
var playingVsComp = false;
var playerOneLetter = "X";
var playerTwoLetter = "O";
var playerOneWins = 0;
var playerTwoWins = 0;
var buttonArr = [[],[],[]];
var gameBoard = document.getElementById('gameBoard-div');
var gameMenu = document.getElementById('menu-div');
var turn = 1;
var draw = false;

$(document).ready(function(){
  buttons = document.getElementsByClassName('gradButton');
  var index = 0;
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      buttons[index].addEventListener("click", selectPos);
      buttonArr[x].push(buttons[index++]);
    }
  }

  document.getElementById('reset').addEventListener("click", resetMatch);
  document.getElementById('back').addEventListener("click", back);
  document.getElementById('vsPlayerBtn').addEventListener("click", vsPlayer);
  document.getElementById('vsCompBtn').addEventListener("click", vsComp);
  document.getElementById('playerX').addEventListener("click", setPlayerOneX);
  document.getElementById('playerO').addEventListener("click", setPlayerOneO);
  gameBoard.parentNode.removeChild(gameBoard);
});

function setPlayerOneX(){
  document.getElementById('playerX').classList.remove("w3-lime");
  document.getElementById('playerX').classList.add("w3-red");
  document.getElementById('playerO').classList.remove("w3-red");
  document.getElementById('playerO').classList.add("w3-lime");
  playerOneLetter = "X";
  playerTwoLetter = "O";
  firstPlayerTurn = true;
}

function setPlayerOneO(){
  document.getElementById('playerO').classList.remove("w3-lime");
  document.getElementById('playerO').classList.add("w3-red");
  document.getElementById('playerX').classList.remove("w3-red");
  document.getElementById('playerX').classList.add("w3-lime");
  playerOneLetter = "O";
  playerTwoLetter = "X";
  firstPlayerTurn = false;
}

function back(){
  gameBoard.parentNode.removeChild(gameBoard);
  document.getElementById('game-div').appendChild(gameMenu);
  playingVsComp = false;
  resetMatch();
  playerOneWins = 0;
  playerTwoWins = 0;
}

function vsPlayer(){
  gameBoard.style.display = 'block';
  gameMenu.parentNode.removeChild(gameMenu);
  document.getElementById('game-div').appendChild(gameBoard);
  playingVsComp = false;
  draw = false;
  resetButtons();
}

function vsComp(){
  gameBoard.style.display = 'block';
  gameMenu.parentNode.removeChild(gameMenu);
  document.getElementById('game-div').appendChild(gameBoard);
  playingVsComp = true;
  draw = false;
  resetButtons();
  if(playerTwoLetter === "X" && playingVsComp)
    compTurn();
}

function resetMatch(){
  resetButtons();
  enableButtons();
  turn = 1;
  draw = false;
  firstPlayerTurn = true;
  if(playerTwoLetter === "X"){
    firstPlayerTurn = false;
    if(playingVsComp)
      compTurn();
  }
}

function selectPos(event){

  console.log(firstPlayerTurn);
  console.log(playerOneLetter+" : "+playerTwoLetter);

  var x = Number($(this).attr("id").substring(1));
  var y = Number($(this).attr("id").substring(0,1));
  if(this.innerHTML === ""){
    if(firstPlayerTurn){
      this.innerHTML = playerOneLetter;
      firstPlayerTurn = false;
    }
    else{
      this.innerHTML = playerTwoLetter;
      firstPlayerTurn = true;
    }
    var currentLetter = this.innerHTML;
    if(checkWinSecondPos(y,x,currentLetter) || checkCentralPos(y,x,currentLetter)){
      getWinner(buttonArr[Number($(this).attr("id").substring(0,1))][Number($(this).attr("id").substring(1))].innerHTML);
    }
    else{
      checkForDraw();
      if(playingVsComp)
        compTurn();
    }
    turn++;
  }

}

function checkWinSecondPos(y, x, letter){
  for(var q = 0; q < 3; q++){
    for(var r = 0; r < 3; r++){
      if(letter === buttonArr[q][r].innerHTML && (y !== q || x !== r)){
        if(checkWinThirdPos(y,x,q,r, letter)){
          return true; 
        }
      }
    }
  }
  return false;
}

function checkWinThirdPos(btny, btnx, coordy, coordx, letter){
  if(isAdjacent(btny, btnx, coordy, coordx) && isInBoundsThirdPos(btny, btnx, coordy, coordx)){
    var finalLetter = (buttonArr[btny+2*(coordy-btny)][btnx+2*(coordx-btnx)].innerHTML === letter);
    return finalLetter;
  }
  return false;
}

function checkCentralPos(y, x, letter){
  for(var q = -1; q < 1; q++){
    for(var r = -1; r < 2; r++){
      if(q !== 0 || r !== 0){
        if(isInBounds(y+q,x+r) && isInBounds(y+q*(-1),x+r*(-1))){
          if(buttonArr[y+q][x+r].innerHTML === letter && buttonArr[y+q*(-1)][x+r*(-1)].innerHTML === letter){
            return true;
          }
        }
      }
    }
  }
  return false;
}

function isInBounds(val1, val2){
  return val1 >= 0 && val1 < 3 && val2 >= 0 && val2 < 3;
}

function isAdjacent(btny, btnx, coordy, coordx){
  return Math.sqrt(Math.pow((coordx-btnx),2)+Math.pow((coordy-btny),2)) < 2;
}

function isInBoundsThirdPos(btny, btnx, coordy, coordx){
  return btnx+2*(coordx-btnx) >= 0 && btnx+2*(coordx-btnx) < 3 && btny+2*(coordy-btny) >= 0 && btny+2*(coordy-btny) < 3;
}

function compTurn(){
  if(draw)
    return;
  disableButtons();

  if(firstPlayerTurn){
    firstPlayerTurn = false;
  }
  else{
    firstPlayerTurn = true;
  }

  turn++;
  //Check to see if there are any winning positions first
  //console.log("Checking Winning Move");
  var buttonVal = "";
  for(var q = 0; q < 3; q++){
    for(var r = 0; r < 3; r++){
      buttonVal = buttonArr[q][r].innerHTML;
      if(buttonVal === ""){
        if(checkWinSecondPos(q,r,playerTwoLetter)){
          //console.log("secPos: "+checkWinSecondPos(q,r,playerTwoLetter)+" == cenPos: "+checkCentralPos(q, r, playerTwoLetter));
          //console.log("q: "+q+" == r: "+r);
          //console.log("Win Detected: ["+buttonVal+"]");
          buttonArr[q][r].innerHTML = playerTwoLetter;
          getWinner(buttonArr[q][r].innerHTML);
          return;
        }
        else if(checkCentralPos(q, r, playerTwoLetter)){
          buttonArr[q][r].innerHTML = playerTwoLetter;
          getWinner(buttonArr[q][r].innerHTML);
          return;
        }
      }
    }
  }

  //Check to see if the player is close to winning
  //console.log("Detecting Threats");
  for(var q = 0; q < 3; q++){
    for(var r = 0; r < 3; r++){
      if(buttonArr[q][r].innerHTML === ""){
        if(checkWinSecondPos(q,r,playerOneLetter) || checkCentralPos(q, r, playerOneLetter)){
          //console.log("Threat Detected");
          buttonArr[q][r].innerHTML = playerTwoLetter;
          enableButtons();
          checkForDraw();
          return;
        }
      }
    }
  }

  //Check adjacent spaces for openinngs.
  //Find playerTwoLetter
  for(var y = 0; y < 3; y++){
    for(var x = 0; x < 3; x++){
      //If the spaces contains playerTwoLetter then search for empty adjacent spaces
      if(buttonArr[y][x].innerHTML === playerTwoLetter){
        //console.log("Regular turn");
        //console.log(y+" : "+x);
        for(var q = -1; q < 2; q++){
          for(var r = -1; r < 2; r++){
            //Make sure the new coordinates don't equal the original coordinates
            if(q !== 0 || r !== 0){
              //Check if adjacent positions are in bounds
              if(isInBounds(y+q,x+r) && isInBounds(y+q*(-1),x+r*(-1))){
                //determine if both sides of the selected position are open
                if(buttonArr[y+q][x+r].innerHTML === "" && buttonArr[y+q*(-1)][x+r*(-1)].innerHTML === ""){
                  //console.log("Checking Both Sides");
                  buttonArr[y+q][x+r].innerHTML = playerTwoLetter;
                  enableButtons();
                  checkForDraw();
                  return;
                }
              }
              if(isInBounds(y+q,x+r) && isInBounds(y+2*(q),x+2*(r))){
                //determine if both sides of the selected position are open
                if(buttonArr[y+q][x+r].innerHTML === "" && buttonArr[y+2*(q)][x+2*(r)].innerHTML === ""){
                  //console.log("Checking Row");
                  buttonArr[y+q][x+r].innerHTML = playerTwoLetter;
                  enableButtons();
                  checkForDraw()
                  return;
                }
              }
            }
          }
        }
      }
    }
  }

  //console.log("Random First Move");
  var randY = Math.floor((Math.random() * 2));
  var tempPos;
  var randArr = [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];
  for(var y = 0; y < 9; y++){
    randY = Math.floor((Math.random() * 8));
    tempPos = randArr[randY];
    randArr[randY]= randArr[y];
    randArr[y] = tempPos;
  }
  var randPos = [];

  while(randArr.length > 0){
    randPos = randArr.pop();
    if(buttonArr[randPos[0]][randPos[1]].innerHTML === ""){
      //console.log(randPos[0]+" : "+randPos[1]);
      buttonArr[randPos[0]][randPos[1]].innerHTML = playerTwoLetter;
      break;
    }
  }

  enableButtons();
  checkForDraw();
  return;

}

function enableButtons(){
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      buttonArr[x][y].disabled = false; 
    }
  }
}

function disableButtons(){
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      buttonArr[x][y].disabled = true; 
    }
  }
}

function resetButtons(){
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      buttonArr[x][y].innerHTML = "";
    }
  }
}

function checkForDraw(){
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      if(buttonArr[x][y].innerHTML === "")
        return false;
    }
  }
  disableButtons();
  alert("Draw");
  draw = true;
  return true;
}

function getWinner(letter){
  console.log("Winner: "+letter);
  if(letter === "X"){
    alert("Winner: P1");
    document.getElementById('playerOneWins').innerHTML = "P1 Wins: "+ ++playerOneWins;
  }
  else{
    alert("Winner: P2");
    document.getElementById('playerTwoWins').innerHTML = "P2 Wins: "+ ++playerTwoWins;
  }

  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      buttonArr[x][y].disabled = true; 
    }
  }
}