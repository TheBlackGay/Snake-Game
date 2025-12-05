'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [eating, setEating] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Initialize high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Generate new food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    // Make sure food doesn't appear on snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  }, [snake]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };
        
        // Move head based on direction
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;
        
        // Check for collisions with walls
        if (
          head.x < 0 || 
          head.x >= GRID_SIZE || 
          head.y < 0 || 
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }
        
        // Check for collisions with self
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }
        
        newSnake.unshift(head);
        
        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          setEating(true);
          setTimeout(() => setEating(false), 300);
          setFood(generateFood());
          setScore(prev => prev + 10);
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPaused, gameOver, food, generateFood]);

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setIsPaused(true);
    setScore(0);
    setEating(false);
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-2 animate-pulse">
            Snake Game
          </h1>
          <p className="text-gray-300 text-lg">Use arrow keys to control the snake</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gray-800 border-gray-700 shadow-2xl shadow-purple-500/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Game Board</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={togglePause}
                    disabled={gameOver}
                    className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetGame}
                    className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="relative bg-gray-900 rounded-xl overflow-hidden border-4 border-gray-700 shadow-lg"
                style={{
                  aspectRatio: '1/1',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                }}
              >
                {/* Grid background */}
                <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 w-full h-full">
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-800 opacity-30"
                    />
                  ))}
                </div>
                
                {/* Food */}
                <div 
                  className={`absolute rounded-full bg-gradient-to-br from-red-500 to-red-600 z-10 ${eating ? 'animate-ping' : 'animate-pulse'}`}
                  style={{
                    width: `calc(100% / ${GRID_SIZE})`,
                    height: `calc(100% / ${GRID_SIZE})`,
                    left: `calc(100% / ${GRID_SIZE} * ${food.x})`,
                    top: `calc(100% / ${GRID_SIZE} * ${food.y})`,
                    boxShadow: '0 0 12px 4px rgba(239, 68, 68, 0.7)',
                  }}
                />
                
                {/* Snake */}
                {snake.map((segment, index) => (
                  <div
                    key={index}
                    className={`absolute rounded-sm ${
                      index === 0 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-green-500 to-green-700'
                    }`}
                    style={{
                      width: `calc(100% / ${GRID_SIZE})`,
                      height: `calc(100% / ${GRID_SIZE})`,
                      left: `calc(100% / ${GRID_SIZE} * ${segment.x})`,
                      top: `calc(100% / ${GRID_SIZE} * ${segment.y})`,
                      transition: 'all 0.1s ease',
                      zIndex: 20 - index,
                      boxShadow: index === 0 
                        ? '0 0 8px 2px rgba(72, 187, 120, 0.7)' 
                        : '0 0 4px 1px rgba(72, 187, 120, 0.5)',
                    }}
                  />
                ))}
                
                {/* Game Over Overlay */}
                {gameOver && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-30 backdrop-blur-sm">
                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
                      <h2 className="text-3xl font-bold text-red-500 mb-4 animate-bounce">Game Over!</h2>
                      <p className="text-gray-300 text-xl mb-2">Your score: <span className="text-yellow-400 font-bold">{score}</span></p>
                      <p className="text-gray-400 mb-6">High score: <span className="text-green-400 font-bold">{highScore}</span></p>
                      <Button 
                        onClick={resetGame}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-lg"
                      >
                        Play Again
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Pause Overlay */}
                {isPaused && !gameOver && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20 backdrop-blur-sm">
                    <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
                      <h2 className="text-3xl font-bold text-yellow-400 mb-6">Game Paused</h2>
                      <Button 
                        onClick={() => setIsPaused(false)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 text-lg"
                      >
                        Resume Game
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                    <span className="text-gray-300">Current:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
                    <span className="text-gray-300">High Score:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {highScore}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg mr-4">
                      <span className="font-mono text-lg">↑</span>
                    </div>
                    <span className="text-gray-300">Move Up</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg mr-4">
                      <span className="font-mono text-lg">↓</span>
                    </div>
                    <span className="text-gray-300">Move Down</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg mr-4">
                      <span className="font-mono text-lg">←</span>
                    </div>
                    <span className="text-gray-300">Move Left</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg mr-4">
                      <span className="font-mono text-lg">→</span>
                    </div>
                    <span className="text-gray-300">Move Right</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-900 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg mr-4">
                      <span className="font-mono text-lg">Space</span>
                    </div>
                    <span className="text-gray-300">Pause/Resume</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">How to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Control the snake using arrow keys</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Eat the red food to grow and earn points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Avoid hitting walls or yourself</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Press spacebar to pause/resume</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400">
          <p className="text-lg">Tip: The game gets more challenging as your snake grows longer!</p>
        </div>
      </div>
    </div>
  );
}
