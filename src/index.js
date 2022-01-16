import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: -1,
          col: -1,
        },
      ],
      stepNumber: 0,
      isXNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) return;
    let row,
      col,
      isXNext = this.state.isXNext;
    squares[i] = isXNext ? "X" : "O";

    switch (i) {
      case 0:
      case 1:
      case 2:
        col = 0;
        break;
      case 3:
      case 4:
      case 5:
        col = 1;
        break;
      case 6:
      case 7:
      case 8:
        col = 2;
        break;
    }
    switch (i) {
      case 0:
      case 3:
      case 6:
        row = 0;
        break;
      case 1:
      case 4:
      case 7:
        row = 1;
        break;
      case 2:
      case 5:
      case 8:
        row = 2;
        break;
    }
    this.setState({
      history: history.concat([
        {
          squares: squares,
          row: row,
          col: col,
        },
      ]),
      stepNumber: history.length,
      isXNext: !isXNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isXNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}` : "Go to game start";
      let button;

      if (move === this.state.stepNumber)
        button = (
          <button onClick={() => this.jumpTo(move)}>
            <strong>
              {desc}, ({history[move].col}, {history[move].row})
            </strong>
          </button>
        );
      else
        button = (
          <button onClick={() => this.jumpTo(move)}>
            {desc}, ({history[move].col}, {history[move].row})
          </button>
        );

      return <li key={move}>{button}</li>;
    });

    let status;
    if (winner) status = `Winner is player ${winner}`;
    else status = `Next player is ${this.state.isXNext ? "X" : "O"}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}
