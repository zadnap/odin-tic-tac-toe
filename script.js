const Gameboard = (function () {
  let board = [];

  function resetBoard() {
    board = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
  }
  resetBoard();

  function updateBoard(index, marker) {
    board[index] = marker;
    DisplayController.updateTile(index);
  }

  return {
    getBoard: () => board,
    resetBoard,
    updateBoard,
  };
})();

const Player = function (marker) {
  return {
    marker,
  };
};

const GameController = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  function addPlayers(player1, player2) {
    players = [player1, player2];
  }
  addPlayers(Player("x"), Player("o"));

  function checkWin() {
    const board = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some((pattern) =>
      pattern.every(
        (index) => board[index] === players[currentPlayerIndex].marker
      )
    );
  }

  function checkTie() {
    return (
      !checkWin() && Gameboard.getBoard().every((tile) => tile !== undefined)
    );
  }

  function playTurn(index) {
    if (!gameOver && !Gameboard.getBoard()[index]) {
      Gameboard.updateBoard(index, players[currentPlayerIndex].marker);
      if (checkWin()) {
        const resultDialog = document.querySelector(".result-dialog");
        resultDialog.classList.add("show");
        resultDialog.showModal();
        resultDialog.querySelector(
          "h3"
        ).textContent = `[${players[currentPlayerIndex].marker}] wins!`;
        gameOver = true;
      } else if (checkTie()) {
        const resultDialog = document.querySelector(".result-dialog");
        resultDialog.classList.add("show");
        resultDialog.showModal();
        resultDialog.querySelector("h3").textContent = "It's a tie";
        gameOver = true;
      } else {
        // Switch turn
        currentPlayerIndex = 1 - currentPlayerIndex;
        DisplayController.updateCurrentPlayer(
          players[currentPlayerIndex].marker
        );
      }
    }
  }

  function resetGame() {
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.renderBoard();
  }

  return {
    playTurn,
    resetGame,
  };
})();

const DisplayController = (function () {
  function renderBoard() {
    const gameboard = document.querySelector(".gameboard");
    gameboard.innerHTML = "";
    Gameboard.getBoard().forEach(() => {
      const newTile = document.createElement("div");
      newTile.classList.add("tile");
      gameboard.appendChild(newTile);
    });
  }
  renderBoard();

  function updateCurrentPlayer(marker) {
    const container = document.querySelector(".container");
    const header = document.querySelector("header h3");
    header.textContent = `${marker}'s turn`;

    if (marker === "o") {
      container.classList.remove("x-turn");
    } else if (marker === "x") {
      container.classList.remove("o-turn");
    }

    container.classList.add(`${marker}-turn`);
  }

  function updateTile(index) {
    const tiles = document.querySelectorAll(".tile");

    switch (Gameboard.getBoard()[index]) {
      case "x":
        tiles[index].innerHTML = `<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
          >
            <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
            />
          </svg>`;
        tiles[index].classList.add("x");
        break;
      case "o":
        tiles[index].innerHTML = `<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="currentColor"
          >
            <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z"
            />
          </svg>`;
        tiles[index].classList.add("o");
        break;
      default:
        break;
    }
  }

  function listenChoosingTile() {
    const tiles = Array.from(document.querySelectorAll(".tile"));
    const gameboard = document.querySelector(".gameboard");

    gameboard.addEventListener("click", (e) => {
      const tileIndex = tiles.indexOf(e.target);

      // If the tile is already clicked once, do not allow to click it one more time
      if (e.target !== gameboard && tileIndex !== -1) {
        GameController.playTurn(tileIndex);
      }
    });
  }
  listenChoosingTile();

  function listenReseting() {
    const reset = document.querySelector(".reset");
    const startNew = document.querySelector(".start-new");

    const handleResetGame = () => {
      const resultDialog = document.querySelector(".result-dialog");
      resultDialog.classList.remove("show");
      resultDialog.close();
      GameController.resetGame();
    };

    reset.addEventListener("click", handleResetGame);
    startNew.addEventListener("click", handleResetGame);
  }
  listenReseting();

  return {
    renderBoard,
    updateTile,
    updateCurrentPlayer,
  };
})();
