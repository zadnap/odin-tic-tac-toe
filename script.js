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
  }

  return {
    getBoard: () => board,
    resetBoard,
    updateBoard,
  };
})();

const Player = function (name, marker) {
  return {
    name,
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
        gameOver = true;
        console.log(`${players[currentPlayerIndex].name} win!`);
      } else if (checkTie()) {
        gameOver = true;
        console.log("It's a tie");
      } else {
        // Switch turn
        currentPlayerIndex = 1 - currentPlayerIndex;
      }
    }
  }

  function resetGame() {
    Gameboard.resetBoard();
    currentPlayerIndex = 0;
    gameOver = false;
  }

  return {
    addPlayers,
    playTurn,
    resetGame,
  };
})();
