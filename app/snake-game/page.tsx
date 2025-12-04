'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const SnakeGame = () => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 }
  ]);
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right');
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Game speed (ms)
  const gameSpeed = 150;

  // Reference to the game interval
  const gameInterval = useRef<NodeJS.Timeout | null>(null);

  // Screen size (in grid cells)
  const gridSize = 20;
  const cellSize = 20;

  // Key press state to prevent rapid direction changes
  const keyPressCooldown = useRef(false);

  // Generate new food position
  const generateFood = () => {
    const newX = Math.floor(Math.random() * gridSize);
    const newY = Math.floor(Math.random() * gridSize);
    return { x: newX, y: newY };
  };

  // Check if snake collides with itself
  const checkCollision = (newHead: { x: number; y: number }) => {
    return snake.some(
      (segment, index) =>
        index > 0 && segment.x === newHead.x && segment.y === newHead.y
    );
  };

  // Check if snake hits wall
  const checkWallCollision = (newHead: { x: number; y: number }) => {
    return (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= gridSize ||
      newHead.y >= gridSize
    );
  };

  // Update game state
  const updateGame = () => {
    setSnake((prevSnake) => {
      const newHead = { ...prevSnake[0] };
      
      // Update head position based on direction
      switch (direction) {
        case 'right':
          newHead.x++;
          break;
        case 'left':
          newHead.x--;
          break;
        case 'up':
          newHead.y--;
          break;
        case 'down':
          newHead.y++;
          break;
      }

      // Check for collisions
      if (checkWallCollision(newHead) || checkCollision(newHead)) {
        setGameOver(true);
        return prevSnake;
      }

      // Check if food is eaten
      const newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 1);
        setFood(generateFood());
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  };

  // Start game
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('right');
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setShowControls(false);

    // Generate initial food
    setFood(generateFood());

    // Start game loop
    if (gameInterval.current) clearInterval(gameInterval.current);
    
    gameInterval.current = setInterval(updateGame, gameSpeed);
  };

  // Pause game
  const pauseGame = () => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
      gameInterval.current = null;
    }
  };

  // Resume game
  const resumeGame = () => {
    if (!gameInterval.current) {
      gameInterval.current = setInterval(updateGame, gameSpeed);
    }
  };

  // Handle keyboard controls with cooldown
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted && !gameOver) return;

    // Cooldown to prevent rapid direction changes
    if (keyPressCooldown.current) return;
    keyPressCooldown.current = true;
    setTimeout(() => {
      keyPressCooldown.current = false;
    }, 150);

    switch (e.key) {
      case 'ArrowRight':
        if (direction !== 'left') setDirection('right');
        break;
      case 'ArrowLeft':
        if (direction !== 'right') setDirection('left');
        break;
      case 'ArrowUp':
        if (direction !== 'down') setDirection('up');
        break;
      case 'ArrowDown':
        if (direction !== 'up') setDirection('down');
        break;
      case 'Enter':
        if (!gameStarted) startGame();
        else if (gameOver) startGame();
        break;
      case 'Escape':
        if (gameStarted && !gameOver) {
          if (gameInterval.current) {
            pauseGame();
          } else {
            resumeGame();
          }
        }
        break;
    }
  };

  // Save high score
  const saveHighScore = (newScore: number) => {
    setHighScore((prev) => Math.max(prev, newScore));
  };

  // Reset game
  const resetGame = () => {
    setGameOver(false);
    startGame();
  };

  // Effect to handle game over state
  useEffect(() => {
    if (gameOver) {
      pauseGame();
      saveHighScore(score);
    }
  }, [gameOver, score]);

  // Effect to handle keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver, gameStarted]);

  // Effect to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust grid size based on screen width
      const newGridSize = Math.min(
        20,
        Math.floor(window.innerWidth / cellSize)
      );
      // You can add logic to adjust grid size on resize if needed
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game board rendering
  const renderBoard = () => {
    return (
      <div className="relative w-full max-w-md">
        {/* Game Board */}
        <div
          className="bg-muted-foreground/20 rounded-lg overflow-hidden"
          style={{
            width: `${gridSize * cellSize}px`,
            height: `${gridSize * cellSize}px`
          }}
        >
          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              left: `${food.x * cellSize}px`,
              top: `${food.y * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded-sm ${
                index === 0 
                  ? 'bg-primary' 
                  : 'bg-primary/80'
              }`}
              style={{
                left: `${segment.x * cellSize}px`,
                top: `${segment.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }}
            />
          ))}
        </div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`
          }}
        />
      </div>
    );
  };

  // Game UI
  const renderUI = () => {
    return (
      <div className="mt-6 space-y-4">
        {/* Score Display */}
        <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm">
          <div>
            <span className="text-muted-foreground">Score:</span>
            <span className="ml-2 text-2xl font-bold text-primary">
              {score}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">High Score:</span>
            <span className="ml-2 text-2xl font-bold text-primary">
              {highScore}
            </span>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">
              How to Play
            </h2>
            <ul className="space-y-3 text-center">
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  ←
                </span>
                <span>Move Left</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  →
                </span>
                <span>Move Right</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  ↑
                </span>
                <span>Move Up</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  ↓
                </span>
                <span>Move Down</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Enter
                </span>
                <span>Start/Restart</span>
              </li>
              <li className="flex items-center justify-center space-x-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Esc
                </span>
                <span>Pause/Resume</span>
              </li>
            </ul>
          </div>
        )}

        {/* Game State Messages */}
        {gameOver && (
          <div className="text-center p-6 bg-destructive/10 text-destructive rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="text-lg mb-6">
              Your score: <span className="font-bold">{score}</span>
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {!gameStarted && !gameOver && (
          <div className="text-center p-6">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-xl hover:bg-primary/90 transition-colors shadow-md"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Snake Game
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Guide the snake to eat food and grow longer. Avoid hitting walls and 
          your own tail to score points!
        </p>
      </div>

      <div className="space-y-8 w-full max-w-md">
        {renderBoard()}
        {renderUI()}
      </div>

      {/* Instructions Overlay */}
      {!gameStarted && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowControls(true)}
            className="p-3 bg-card rounded-full shadow-lg hover:bg-muted transition-colors"
          >
            <span className="text-2xl">?</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
