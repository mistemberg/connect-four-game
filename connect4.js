class Game {
  constructor(p1, p2, height = 6, width = 7) { // Create a class called "Game" with a constructor that takes two players and optional height and width.
    this.players = [p1, p2]; // Store the players in an array.
    this.height = height; // Set the height of the game board.
    this.width = width; // Set the width of the game board.
    this.currPlayer = p1; // Set the current player to player 1.
    this.makeBoard(); // Create the game board.
    this.makeHtmlBoard(); // Create the HTML representation of the game board.
    this.gameOver = false; // Set the initial game over state to false.
  }
  
  makeBoard() { // Create the game board as an array.
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  
  makeHtmlBoard() { // Create the HTML representation of the game board.
    const board = document.getElementById('board'); // Get the 'board' element from the HTML document.
    board.innerHTML = ''; // Clear the contents of the board element.

    const top = document.createElement('tr'); // Create a table row for the top row.
    top.setAttribute('id', 'column-top'); // Set the ID of the top row element.
    this.handleGameClick = this.handleClick.bind(this); // Create a bound event handler for game clicks.
    top.addEventListener("click", this.handleGameClick); // Add a click event listener to the top row.

    for (let x = 0; x < this.width; x++) { // Create table cells for each column in the top row.
      const headCell = document.createElement('td'); // Create a table cell.
      headCell.setAttribute('id', x); // Set the ID of the table cell to the column index.
      top.append(headCell); // Append the table cell to the top row.
    }

    board.append(top); // Append the top row to the game board.

    for (let y = 0; y < this.height; y++) { // Create table rows for each row in the game board.
      const row = document.createElement('tr'); // Create a table row.
      
      for (let x = 0; x < this.width; x++) { // Create table cells for each column in the row.
        const cell = document.createElement('td'); // Create a table cell.
        cell.setAttribute('id', `${y}-${x}`); // Set the ID of the table cell to the cell coordinates.
        row.append(cell); // Append the table cell to the row.
      }
    
      board.append(row); // Append the row to the game board.
    }
  }

  findSpotForCol(x) { // Find an available spot in a specific column.
    for (let y = this.height - 1; y >= 0; y--) { // Iterate over the rows in the column from bottom to top.
      if (!this.board[y][x]) { // If the cell is empty.
        return y; // Return the row index.
      }
    }
    return null; // If the column is full, return null.
  }

  placeInTable(y, x) { // Place a game piece in the HTML table at the specified coordinates.
    const piece = document.createElement('div'); // Create a div element for the game piece.
    piece.classList.add('piece'); // Add the 'piece' class to the game piece.
    piece.style.backgroundColor = this.currPlayer.color; // Set the background color of the game piece.

    piece.style.top = -50 * (y + 2); // Set the top position of the game piece based on the row index.

    const spot = document.getElementById(`${y}-${x}`); // Get the specific cell element.
    spot.append(piece); // Append the game piece to the cell element.
  }

  endGame(msg) { // End the game with a given message.
    alert(msg); // Display an alert with the message.
    const top = document.querySelector("#column-top"); // Get the top row element.
    top.removeEventListener("click", this.handleGameClick); // Remove the click event listener from the top row.
  }

  handleClick(evt) { // Handle the click event on the game board.
    const x = +evt.target.id; // Get the column index from the clicked element's ID.

    const y = this.findSpotForCol(x); // Find an available spot in the clicked column.
    if (y === null) { // If the column is full.
      return; // Return and do nothing.
    }

    this.board[y][x] = this.currPlayer; // Update the game board with the current player's symbol at the clicked position.
    this.placeInTable(y, x); // Place the game piece in the HTML table at the clicked position.

    if (this.board.every(row => row.every(cell => cell))) { // Check if the game has resulted in a tie (all cells are filled).
      return this.endGame('Tie! Game Over.'); // If there is a tie, end the game with a tie message.
    }

    if (this.checkForWin()) { // Check if the current player has won the game by calling the checkForWin() method.
      this.gameOver = true; // Set the game over state to true.
      return this.endGame(`The ${this.currPlayer.color} player WON!`); // If there is a win, end the game with a win message.
    }

    this.currPlayer = (this.currPlayer === this.players[0]) ? this.players[1] : this.players[0]; // Switch the current player to the next player.
  }

  checkForWin() { // Check for a win condition on the game board.
    const _win = cells => // Helper function to check if a set of cells belongs to the current player.
      cells.every(([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) { // Iterate over each cell in the game board.
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // Define a horizontal line.
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // Define a vertical line.
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // Define a diagonal (from top-left to bottom-right) line.
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // Define a diagonal (from top-right to bottom-left) line.

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { // If any of the lines contain all cells belonging to the current player.
          return true; // Return true, indicating a win.
        }
      }
    }
  }
}

class Player { // Define a class called "Player" to represent a player with a color.
  constructor(color) { // Create a constructor that takes a color parameter.
    this.color = color; // Assign the color to the player object.
  }
}

document.getElementById('start-game').addEventListener('click', () => { // Attach a click event listener to the 'start-game' button element.
  let p1 = new Player(document.getElementById('p1-color').value); // Create a new player object for player 1 based on the input color.
  let p2 = new Player(document.getElementById('p2-color').value); // Create a new player object for player 2 based on the input color.
  new Game(p1, p2); // Create a new game instance with the two players.
});
