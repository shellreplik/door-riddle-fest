import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const Index = () => {
  const { toast } = useToast();
  const [targetDoor, setTargetDoor] = useState<number | null>(null);
  const [doors] = useState(Array.from({ length: 30 }, (_, i) => i + 1));
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [audio] = useState(new Audio('/mingle.mp3'));
  const [speechSynthesis] = useState(window.speechSynthesis);

  const speakNumber = useCallback((number: number) => {
    const utterance = new SpeechSynthesisUtterance(`Click the ${number} door`);
    speechSynthesis.speak(utterance);
    setTargetDoor(number);
    setGameActive(true);
    console.log('Target door set to:', number);
  }, [speechSynthesis]);

  const handleDoorClick = (doorNumber: number) => {
    if (!gameActive) return;
    
    console.log('Door clicked:', doorNumber, 'Target:', targetDoor);
    
    if (doorNumber === targetDoor) {
      toast({
        title: "Correct!",
        description: "You found the right door!",
        className: "bg-green-500",
      });
      setScore(prev => prev + 1);
    } else {
      toast({
        title: "Wrong door!",
        description: `The correct door was ${targetDoor}`,
        variant: "destructive",
      });
      setScore(0);
    }
    setGameActive(false);
    setTargetDoor(null);
  };

  useEffect(() => {
    const scheduleNextRound = () => {
      const delay = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000; // Random delay between 5-30 seconds
      console.log('Scheduling next round in:', delay, 'ms');
      
      setTimeout(() => {
        if (!gameActive) {
          audio.play();
          const newTarget = Math.floor(Math.random() * 30) + 1;
          speakNumber(newTarget);
        }
      }, delay);
    };

    scheduleNextRound();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, gameActive, speakNumber]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-600 p-8">
      <article className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Door Clicking Game</h1>
          <p className="text-xl text-white mb-4">Score: {score}</p>
          {gameActive && (
            <p className="text-2xl text-yellow-300 animate-pulse">
              Find door number {targetDoor}!
            </p>
          )}
        </header>
        
        <section className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {doors.map((door) => (
            <button
              key={door}
              onClick={() => handleDoorClick(door)}
              className={cn(
                "h-32 w-full bg-gradient-to-b from-yellow-800 to-yellow-900",
                "rounded-lg shadow-lg transform transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "border-4 border-yellow-700",
                "flex items-center justify-center",
                "relative",
                gameActive && targetDoor === door && "animate-bounce"
              )}
              aria-label={`Door ${door}`}
            >
              <span className="absolute right-4 top-1/2 w-4 h-4 bg-yellow-500 rounded-full" 
                    aria-hidden="true" 
                    role="presentation"></span>
              <span className="text-2xl font-bold text-yellow-500">{door}</span>
            </button>
          ))}
        </section>
      </article>
    </main>
  );
};

export default Index;