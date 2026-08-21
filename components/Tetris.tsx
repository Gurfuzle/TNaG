'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 24;

const PIECES = [
  { shape: [[1,1,1,1]], color: '#00f0f0' },           // I
  { shape: [[1,1],[1,1]], color: '#f0f000' },          // O
  { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },      // T
  { shape: [[1,0,0],[1,1,1]], color: '#0000f0' },      // J
  { shape: [[0,0,1],[1,1,1]], color: '#f0a000' },      // L
  { shape: [[0,1,1],[1,1,0]], color: '#00f000' },      // S
  { shape: [[1,1,0],[0,1,1]], color: '#f00000' },      // Z
];

type Board = (string | null)[][];

function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { shape: p.shape.map(r => [...r]), color: p.color, x: 3, y: 0 };
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = [];
  for (let c = 0; c < cols; c++) {
    rotated.push([]);
    for (let r = rows - 1; r >= 0; r--) {
      rotated[c].push(shape[r][c]);
    }
  }
  return rotated;
}

function collides(board: Board, shape: number[][], x: number, y: number): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = x + c;
      const ny = y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function merge(board: Board, shape: number[][], color: string, x: number, y: number): Board {
  const newBoard = board.map(r => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && y + r >= 0) {
        newBoard[y + r][x + c] = color;
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const remaining = board.filter(row => row.some(cell => !cell));
  const cleared = ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array(COLS).fill(null));
  return { board: [...empty, ...remaining], cleared };
}

export default function Tetris() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [piece, setPiece] = useState(randomPiece);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const drop = useCallback(() => {
    if (gameOver) return;
    const newY = piece.y + 1;
    if (!collides(board, piece.shape, piece.x, newY)) {
      setPiece(p => ({ ...p, y: newY }));
    } else {
      const merged = merge(board, piece.shape, piece.color, piece.x, piece.y);
      const { board: cleared, cleared: lines } = clearLines(merged);
      setBoard(cleared);
      setScore(s => s + lines * 100);
      const next = randomPiece();
      if (collides(cleared, next.shape, next.x, next.y)) {
        setGameOver(true);
      } else {
        setPiece(next);
      }
    }
  }, [board, piece, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    intervalRef.current = setInterval(drop, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [drop, started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        if (!collides(board, piece.shape, piece.x - 1, piece.y))
          setPiece(p => ({ ...p, x: p.x - 1 }));
      } else if (e.key === 'ArrowRight') {
        if (!collides(board, piece.shape, piece.x + 1, piece.y))
          setPiece(p => ({ ...p, x: p.x + 1 }));
      } else if (e.key === 'ArrowDown') {
        drop();
      } else if (e.key === 'ArrowUp') {
        const rotated = rotate(piece.shape);
        if (!collides(board, rotated, piece.x, piece.y))
          setPiece(p => ({ ...p, shape: rotated }));
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, piece, drop, started, gameOver]);

  function restart() {
    setBoard(createBoard());
    setPiece(randomPiece());
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#003366' }}>
        Score: {score}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          gap: '1px',
          background: '#222',
          border: '2px solid #003366',
          borderRadius: '4px',
          padding: '1px',
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            let color = cell;
            if (!color) {
              const pr = r - piece.y;
              const pc = c - piece.x;
              if (
                pr >= 0 && pr < piece.shape.length &&
                pc >= 0 && pc < piece.shape[0].length &&
                piece.shape[pr][pc]
              ) {
                color = piece.color;
              }
            }
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: color || '#111',
                  borderRadius: '2px',
                }}
              />
            );
          })
        )}
      </div>
      {!started && (
        <button onClick={restart} className="btn" style={{ marginTop: '0.5rem' }}>
          Start Game
        </button>
      )}
      {gameOver && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#c00', marginBottom: '0.5rem' }}>Game Over!</p>
          <button onClick={restart} className="btn">Play Again</button>
        </div>
      )}
      {started && !gameOver && (
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Arrow keys: ← → move, ↑ rotate, ↓ drop
        </p>
      )}
    </div>
  );
}
