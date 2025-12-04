export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Welcome to Snake Game
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Play the classic Snake game with a modern twist! Guide your snake 
          through the grid, collect food, and achieve the highest score possible.
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          <div className="p-6 bg-muted/50 border-b border-border">
            <h2 className="text-2xl font-bold text-center">How to Play</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Objective</h3>
              <p className="text-muted-foreground">
                Guide the snake to eat food (red dots) and grow longer. Each piece of 
                food increases your score by 1 point.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Controls</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-primary font-bold mb-2">←</div>
                  <span>Move Left</span>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-primary font-bold mb-2">→</div>
                  <span>Move Right</span>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-primary font-bold mb-2">↑</div>
                  <span>Move Up</span>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-primary font-bold mb-2">↓</div>
                  <span>Move Down</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Game Rules</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Avoid hitting the walls</li>
                <li>• Don't collide with your own tail</li>
                <li>• Each food item = +1 point</li>
                <li>• Game ends on collision</li>
                <li>• Press Enter to start/restart</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Scoring</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Score: 0</p>
                <p className="text-muted-foreground mt-2">
                  Your score increases by 1 for each food item collected.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">High Score</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">High Score: 0</p>
              </div>
            </div>

            <a
              href="/snake-game"
              className="block w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg font-bold text-center text-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              Start Playing
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-muted-foreground">
        <p>Created with Next.js, Tailwind CSS, and React</p>
      </footer>
    </div>
  );
}
