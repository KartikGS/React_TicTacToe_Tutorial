import { useState } from "react";

export function Square({value, onSquareClick, active}) {
  return <button className="square" onClick={onSquareClick} style={{ backgroundColor: active ? 'red' : 'initial' }}>{value}</button>;
}

function  Toggle({value, onToggle}){
  return <button onClick={onToggle}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i){
    const nextSquares = squares.slice();
    if(calculateWinner(squares) || nextSquares[i]){
      return;
    }
    if(xIsNext){
      nextSquares[i]='X';
    }
    else{
      nextSquares[i]='O';
    }
    
    onPlay(nextSquares);
  }

  const board = [['1','2','3'],['4','5','6'],['7','8','9']];

  const {winner, line} = calculateWinner(squares) || {};
  console.log(line)
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
  <>
  <div className="status">{status}</div>
  {board.map((row,i)=>(
    <div className="board-row" key={i}>
      {row.map((square,j)=>(
        <Square value={squares[square-1]} onSquareClick={()=>{handleClick(square-1)}} active={line?.includes(j+3*i)} key={j+3*i}/>
      ))}
    </div>
  ))}
  </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [order, setOrder] = useState('Asending')

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggle(){
    if(order==='Descending') setOrder('Asending');
    else setOrder('Descending')
  }

  const moves = history.map((squares, move) => {


    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description+' '+move}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        
      </div>
      <div className="game-info">
      <Toggle onToggle={toggle} value={order}/>
      <ol>{order==='Descending'?moves.reverse():moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner :squares[a], line:lines[i]};
    }
  }
  return null;
}