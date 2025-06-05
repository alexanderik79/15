import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './index.css';

function App() {
  const [board, setBoard] = useState([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const findEmptyTile = (board) => {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (board[y][x] === 0) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const isAdjacent = (x, y, emptyPos) => {
    return (
      (x === emptyPos.x && Math.abs(y - emptyPos.y) === 1) ||
      (y === emptyPos.y && Math.abs(x - emptyPos.x) === 1)
    );
  };

  const moveTile = (x, y) => {
    const emptyPos = findEmptyTile(board);
    if (isAdjacent(x, y, emptyPos)) {
      const newBoard = board.map(row => [...row]);
      [newBoard[y][x], newBoard[emptyPos.y][emptyPos.x]] = [
        newBoard[emptyPos.y][emptyPos.x],
        newBoard[y][x]
      ];
      setBoard(newBoard);
      setMoves(moves + 1);
      if (checkWin(newBoard)) {
        setWon(true);
      }
    }
  };

  const checkWin = (board) => {
    const winBoard = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 0]
    ];
    return board.every((row, i) =>
      row.every((tile, j) => tile === winBoard[i][j])
    );
  };

  const mixBoard = () => {
    const newBoard = board.map(row => [...row]);
    for (let i = 0; i < 100; i++) {
      const emptyPos = findEmptyTile(newBoard);
      const directions = [
        { x: emptyPos.x + 1, y: emptyPos.y },
        { x: emptyPos.x - 1, y: emptyPos.y },
        { x: emptyPos.x, y: emptyPos.y + 1 },
        { x: emptyPos.x, y: emptyPos.y - 1 }
      ].filter(
        pos => pos.x >= 0 && pos.x < 4 && pos.y >= 0 && pos.y < 4
      );
      const randomPos =
        directions[Math.floor(Math.random() * directions.length)];
      [newBoard[emptyPos.y][emptyPos.x], newBoard[randomPos.y][randomPos.x]] = [
        newBoard[randomPos.y][randomPos.x],
        newBoard[emptyPos.y][emptyPos.x]
      ];
    }
    setBoard(newBoard);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const emptyPos = findEmptyTile(board);
      if (e.key === 'ArrowUp') moveTile(emptyPos.x, emptyPos.y + 1);
      if (e.key === 'ArrowDown') moveTile(emptyPos.x, emptyPos.y - 1);
      if (e.key === 'ArrowLeft') moveTile(emptyPos.x + 1, emptyPos.y);
      if (e.key === 'ArrowRight') moveTile(emptyPos.x - 1, emptyPos.y);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board]);

  const tiles = [];
  board.forEach((row, rowIndex) =>
    row.forEach((tile, colIndex) => {
      if (tile !== 0) {
        tiles.push({ value: tile, x: colIndex, y: rowIndex });
      }
    })
  );

  return (
    <div>
      <h1>15</h1>
      <p>Steps: {moves}</p>
      {won && <p style={{ color: 'green' }}>You Win!</p>}
      <button onClick={mixBoard}>New Game</button>
      <div className="game-board">
        {tiles.map(tile => (
          <motion.div
            key={tile.value}
            className="tile"
            animate={{ x: tile.x * 82, y: tile.y * 82 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={() => moveTile(tile.x, tile.y)}
          >
            {tile.value}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;