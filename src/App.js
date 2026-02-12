import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Stars } from 'lucide-react';

export default function ValentineGame() {
  const [gameStage, setGameStage] = useState('intro'); // intro, minigame, wordgame, question, celebration
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [hearts, setHearts] = useState([]);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const gameAreaRef = useRef(null);
  const noButtonRef = useRef(null);
  
  // Word guessing game states
  const valentineWords = [
    { word: 'CUPID', hint: "🏹 The Roman god of love with wings and arrows" },
    { word: 'ROSES', hint: "🌹 Classic romantic flowers, often red" },
    { word: 'HEARTS', hint: "💕 The universal symbol of love" },
    { word: 'SWEET', hint: "🍬 Like chocolates and loving words" },
    { word: 'CRUSH', hint: "😊 When you can't stop thinking about someone" },
    { word: 'ROMANCE', hint: "💑 Love, passion, and affection combined" }
  ];
  const [targetWordObj, setTargetWordObj] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [revealMessage, setRevealMessage] = useState(false);
  const [revealedWords, setRevealedWords] = useState([]);
  const maxGuesses = 6;
  const secretMessage = ['WILL', 'YOU', 'BE', 'MY', 'VALENTINE?', 'PLEASE'];

  // Mini-game: Generate falling hearts
  useEffect(() => {
    if (gameStage === 'minigame') {
      const interval = setInterval(() => {
        const newHeart = {
          id: Math.random(),
          x: Math.random() * 90,
          speed: 2 + Math.random() * 2,
          size: 30 + Math.random() * 20,
          rotation: Math.random() * 360,
        };
        setHearts(prev => [...prev, newHeart]);

        // Remove hearts that are too old
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 5000);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [gameStage]);

  // Timer for mini-game
  useEffect(() => {
    if (gameStage === 'minigame' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStage === 'minigame' && timeLeft === 0) {
      setTimeout(() => {
        const wordObj = valentineWords[Math.floor(Math.random() * valentineWords.length)];
        setTargetWordObj(wordObj);
        setTargetWord(wordObj.word);
        setGameStage('wordgame');
      }, 500);
    }
  }, [timeLeft, gameStage]);

  // Word game functions
  const handleKeyPress = (letter) => {
    if (currentGuess.length < targetWord.length) {
      setCurrentGuess(currentGuess + letter);
    }
  };

  const handleBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== targetWord.length) {
      setGameMessage('Not enough letters!');
      setTimeout(() => setGameMessage(''), 1500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setGameMessage('Perfect! 💕');
      setTimeout(() => setGameStage('question'), 1500);
    } else if (newGuesses.length >= maxGuesses) {
      // Trigger special message reveal
      setGameMessage('');
      setTimeout(() => {
        setRevealMessage(true);
        // Animate words appearing one by one
        secretMessage.forEach((word, index) => {
          setTimeout(() => {
            setRevealedWords(prev => [...prev, word]);
          }, index * 600);
        });
        // Move to question after all words revealed
        setTimeout(() => {
          setGameStage('question');
        }, secretMessage.length * 600 + 1500);
      }, 800);
    } else {
      setGameMessage('');
    }
  };

  const getLetterColor = (letter, index, guess) => {
    if (guess[index] === targetWord[index]) {
      return 'bg-green-500 border-green-600'; // Correct position
    } else if (targetWord.includes(guess[index])) {
      return 'bg-yellow-500 border-yellow-600'; // In word, wrong position
    }
    return 'bg-gray-400 border-gray-500'; // Not in word
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  const catchHeart = (heartId) => {
    setScore(score + 1);
    setHearts(prev => prev.filter(h => h.id !== heartId));
  };

  const moveNoButton = () => {
    if (!gameAreaRef.current || !noButtonRef.current) return;

    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const buttonRect = noButtonRef.current.getBoundingClientRect();
    
    const maxX = gameRect.width - buttonRect.width - 40;
    const maxY = gameRect.height - buttonRect.height - 40;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonAttempts(prev => prev + 1);
  };

  const handleYes = () => {
    setGameStage('celebration');
    
    // Create confetti
    const newConfetti = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      color: ['#ff6b9d', '#c44569', '#ff9ff3', '#feca57'][Math.floor(Math.random() * 4)],
      size: 8 + Math.random() * 6,
    }));
    setConfetti(newConfetti);
  };

  const getNoButtonMessage = () => {
    if (noButtonAttempts === 0) return "No";
    if (noButtonAttempts < 3) return "Try again 😏";
    if (noButtonAttempts < 5) return "Nope! 💕";
    if (noButtonAttempts < 8) return "Not happening!";
    return "Just click Yes! 💝";
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    }}>
      {/* Animated background hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Heart size={40 + Math.random() * 40} fill="white" stroke="none" />
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@400;600;700&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(15deg); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes confettiExplode {
          0% { 
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translate(var(--vx), var(--vy)) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .pacifico { font-family: 'Pacifico', cursive; }
        .quicksand { font-family: 'Quicksand', sans-serif; }
        
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* INTRO STAGE */}
        {gameStage === 'intro' && (
          <div className="text-center max-w-2xl px-4" style={{ animation: 'slideIn 0.6s ease-out' }}>
            <div className="mb-6 sm:mb-8">
              <Heart size={60} className="mx-auto mb-4 sm:mb-6 sm:w-20 sm:h-20" fill="#ff6b9d" stroke="#c44569" strokeWidth={2} 
                style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }} />
            </div>
            
            <h1 className="pacifico text-4xl sm:text-5xl md:text-7xl text-white mb-4 sm:mb-6 drop-shadow-lg">
              Valentine's Quest
            </h1>
            
            <p className="quicksand text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 font-semibold px-2">
              Before I ask you something special...
              <br />
              Let's play TWO little games! 💕
            </p>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 border-2 border-white/30">
              <Sparkles size={32} className="mx-auto mb-3 sm:mb-4 sm:w-10 sm:h-10 text-yellow-300" />
              <p className="quicksand text-lg sm:text-xl text-white font-semibold mb-3 sm:mb-4">
                Game 1: Catch the Hearts
              </p>
              <p className="quicksand text-base sm:text-lg text-white/80 mb-4 sm:mb-6">
                Click the falling hearts in 15 seconds
              </p>
              <Heart size={24} className="mx-auto mb-2 sm:mb-3 sm:w-8 sm:h-8 text-pink-300" />
              <p className="quicksand text-lg sm:text-xl text-white font-semibold mb-2">
                Game 2: Guess the Word
              </p>
              <p className="quicksand text-base sm:text-lg text-white/80">
                Solve a Valentine's themed word puzzle
              </p>
            </div>
            
            <button
              onClick={() => setGameStage('minigame')}
              className="pacifico text-2xl sm:text-3xl bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full 
                shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50 
                border-4 border-white/30"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            >
              Let's Play! 💖
            </button>
          </div>
        )}

        {/* MINI-GAME STAGE */}
        {gameStage === 'minigame' && (
          <div className="w-full max-w-4xl px-4">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-white/30">
              <div className="flex justify-between items-center quicksand text-white font-bold text-lg sm:text-2xl">
                <div>
                  <span className="text-yellow-300">⏱️</span> Time: {timeLeft}s
                </div>
                <div>
                  <span className="text-pink-300">💕</span> Score: {score}
                </div>
              </div>
            </div>
            
            <div 
              className="relative bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-4 border-white/30 overflow-hidden"
              style={{ height: '400px', maxHeight: '60vh' }}
            >
              {hearts.map(heart => (
                <button
                  key={heart.id}
                  onClick={() => catchHeart(heart.id)}
                  className="absolute cursor-pointer transform transition-transform hover:scale-125 active:scale-125"
                  style={{
                    left: `${heart.x}%`,
                    animation: `fall ${heart.speed}s linear`,
                    transform: `rotate(${heart.rotation}deg)`,
                  }}
                >
                  <Heart 
                    size={heart.size} 
                    fill="#ff6b9d" 
                    stroke="#c44569" 
                    strokeWidth={2}
                    className="drop-shadow-lg"
                  />
                </button>
              ))}
              
              {timeLeft <= 3 && timeLeft > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="pacifico text-6xl sm:text-9xl text-white drop-shadow-2xl">
                    {timeLeft}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORD GUESSING GAME STAGE */}
        {gameStage === 'wordgame' && (
          <div className="w-full max-w-xl px-4" style={{ animation: 'slideIn 0.6s ease-out' }}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="pacifico text-3xl sm:text-4xl md:text-5xl text-white mb-3 sm:mb-4 drop-shadow-lg">
                Guess the Word! 💌
              </h2>
              <p className="quicksand text-base sm:text-lg md:text-xl text-white/90 font-semibold mb-3">
                Valentine's themed word • {targetWord.length} letters
              </p>
              {targetWordObj && (
                <div className="bg-gradient-to-r from-pink-500/30 to-rose-500/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-pink-300/50">
                  <p className="quicksand text-sm sm:text-base md:text-lg text-white font-semibold">
                    💡 Hint: {targetWordObj.hint}
                  </p>
                </div>
              )}
            </div>

            {/* Game message */}
            {gameMessage && (
              <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 border-2 border-white/30 text-center">
                <p className="quicksand text-lg sm:text-xl text-white font-bold">{gameMessage}</p>
              </div>
            )}

            {/* Guess grid */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 border-2 border-white/30">
              {!revealMessage ? (
                <>
                  <div className="space-y-2 sm:space-y-3 mb-4">
                    {/* Previous guesses */}
                    {guesses.map((guess, guessIndex) => (
                      <div key={guessIndex} className="flex gap-1 sm:gap-2 justify-center">
                        {guess.split('').map((letter, letterIndex) => (
                          <div
                            key={letterIndex}
                            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 sm:border-4 
                              ${getLetterColor(letter, letterIndex, guess)} 
                              transform transition-all duration-300`}
                            style={{ 
                              animationDelay: `${letterIndex * 0.1}s`,
                              animation: 'slideIn 0.3s ease-out'
                            }}
                          >
                            <span className="quicksand text-lg sm:text-xl md:text-2xl font-bold text-white">{letter}</span>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Current guess */}
                    {guesses.length < maxGuesses && (
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        {Array.from({ length: targetWord.length }).map((_, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 sm:border-4 
                              bg-white/20 border-white/40"
                          >
                            <span className="quicksand text-lg sm:text-xl md:text-2xl font-bold text-white">
                              {currentGuess[index] || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty rows */}
                    {Array.from({ length: maxGuesses - guesses.length - 1 }).map((_, index) => (
                      <div key={`empty-${index}`} className="flex gap-1 sm:gap-2 justify-center">
                        {Array.from({ length: targetWord.length }).map((_, letterIndex) => (
                          <div
                            key={letterIndex}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg border-2 sm:border-4 bg-white/5 border-white/20"
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Keyboard */}
                  <div className="space-y-1 sm:space-y-2 mt-6 sm:mt-8">
                    {keyboard.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1 justify-center">
                        {row.map((key) => {
                          const isSpecial = key === 'ENTER' || key === '⌫';
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                if (key === 'ENTER') handleSubmitGuess();
                                else if (key === '⌫') handleBackspace();
                                else handleKeyPress(key);
                              }}
                              className={`${isSpecial ? 'px-2 sm:px-4' : 'px-1.5 sm:px-3'} py-2 sm:py-3 rounded-md sm:rounded-lg 
                                bg-white/20 hover:bg-white/30 active:bg-white/40 border border-white/30 sm:border-2
                                transition-all duration-200 transform active:scale-95 touch-manipulation`}
                            >
                              <span className="quicksand text-xs sm:text-sm font-bold text-white">
                                {key}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="quicksand text-xs sm:text-sm text-white/70 font-semibold">
                      🟩 Correct • 🟨 Wrong spot • ⬜ Not in word
                    </p>
                  </div>
                </>
              ) : (
                /* Special Message Reveal */
                <div className="space-y-3 sm:space-y-4 py-6 sm:py-8">
                  {revealedWords.map((word, index) => (
                    <div 
                      key={index} 
                      className="flex gap-1 sm:gap-2 justify-center"
                      style={{ animation: 'slideIn 0.6s ease-out' }}
                    >
                      {word.split('').map((letter, letterIndex) => (
                        <div
                          key={letterIndex}
                          className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg border-2 sm:border-4 
                            bg-gradient-to-br from-pink-500 to-rose-500 border-pink-300
                            transform transition-all duration-300"
                          style={{ 
                            animationDelay: `${letterIndex * 0.05}s`,
                            animation: 'heartbeat 0.6s ease-out'
                          }}
                        >
                          <span className="pacifico text-base sm:text-xl md:text-2xl text-white drop-shadow-lg">
                            {letter}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {revealedWords.length === secretMessage.length && (
                    <div className="text-center mt-6 sm:mt-8">
                      <Heart size={50} className="mx-auto text-pink-300 sm:w-16 sm:h-16" 
                        style={{ animation: 'heartbeat 1s ease-in-out infinite' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUESTION STAGE */}
        {gameStage === 'question' && (
          <div ref={gameAreaRef} className="relative w-full max-w-2xl min-h-[500px] sm:min-h-[600px] px-4" style={{ animation: 'slideIn 0.6s ease-out' }}>
            <div className="text-center">
              <div className="mb-6 sm:mb-8">
                <Stars size={40} className="mx-auto mb-3 sm:mb-4 sm:w-16 sm:h-16 text-yellow-300" style={{ animation: 'heartbeat 2s ease-in-out infinite' }} />
              </div>
              
              <h2 className="pacifico text-4xl sm:text-5xl md:text-6xl text-white mb-4 sm:mb-6 drop-shadow-lg">
                Nice work! 🌟
              </h2>
              
              <p className="quicksand text-xl sm:text-2xl md:text-3xl text-white/90 mb-3 sm:mb-4 font-semibold px-2">
                You caught {score} hearts
                <br />
                {guesses.length > 0 && guesses[guesses.length - 1] === targetWord 
                  ? "and guessed the word! ✨" 
                  : "and tried your best! 💫"}
              </p>
              
              <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 border-2 border-white/30">
                <h3 className="pacifico text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-6 leading-tight">
                  Will you be
                  <br />
                  my Valentine? 💝
                </h3>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <button
                  onClick={handleYes}
                  className="pacifico text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-pink-500 to-rose-500 text-white 
                    px-12 sm:px-16 py-4 sm:py-5 rounded-full w-full sm:w-auto
                    shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50 
                    border-4 border-white/30 relative z-20"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                >
                  Yes! 💖
                </button>
                
                <button
                  ref={noButtonRef}
                  onMouseEnter={moveNoButton}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    moveNoButton();
                  }}
                  className="pacifico text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-gray-400 to-gray-500 text-white 
                    px-12 sm:px-16 py-4 sm:py-5 rounded-full w-full sm:w-auto
                    shadow-2xl border-4 border-white/30 transition-all duration-200"
                  style={{
                    left: noButtonAttempts === 0 ? 'auto' : `${noButtonPosition.x}px`,
                    top: noButtonAttempts === 0 ? 'auto' : `${noButtonPosition.y}px`,
                    position: noButtonAttempts === 0 ? 'relative' : 'absolute',
                  }}
                >
                  {getNoButtonMessage()}
                </button>
              </div>
              
              {noButtonAttempts > 0 && (
                <p className="quicksand text-lg sm:text-xl text-white/80 mt-6 sm:mt-8 font-semibold px-4">
                  {noButtonAttempts < 3 && "Oops! It moved! 😊"}
                  {noButtonAttempts >= 3 && noButtonAttempts < 6 && "You know you want to say yes! 😉"}
                  {noButtonAttempts >= 6 && "Come on, just admit it! 💕"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* CELEBRATION STAGE */}
        {gameStage === 'celebration' && (
          <div className="text-center max-w-2xl px-4" style={{ animation: 'slideIn 0.6s ease-out' }}>
            {/* Confetti */}
            {confetti.map(c => (
              <div
                key={c.id}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  backgroundColor: c.color,
                  '--vx': `${c.vx * 50}px`,
                  '--vy': `${c.vy * 50}px`,
                  animation: 'confettiExplode 2s ease-out forwards',
                }}
              />
            ))}
            
            <div className="mb-6 sm:mb-8">
              <Heart size={80} className="mx-auto mb-4 sm:mb-6 sm:w-32 sm:h-32" fill="#ff6b9d" stroke="white" strokeWidth={3} 
                style={{ animation: 'heartbeat 1s ease-in-out infinite' }} />
            </div>
            
            <h1 className="pacifico text-5xl sm:text-6xl md:text-8xl text-white mb-6 sm:mb-8 drop-shadow-lg">
              Yay! 🎉
            </h1>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 border-2 border-white/30">
              <p className="quicksand text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 sm:mb-6 leading-relaxed">
                You've made me the
                <br />
                happiest person! 💕
              </p>
              
              <p className="quicksand text-xl sm:text-2xl text-white/90 font-semibold">
                Happy Valentine's Day! ✨
              </p>
            </div>
            
            <button
              onClick={() => {
                setGameStage('intro');
                setScore(0);
                setTimeLeft(15);
                setNoButtonAttempts(0);
                setConfetti([]);
                setGuesses([]);
                setCurrentGuess('');
                setTargetWord('');
                setTargetWordObj(null);
                setGameMessage('');
                setRevealMessage(false);
                setRevealedWords([]);
              }}
              className="quicksand text-lg sm:text-xl text-white/80 hover:text-white mt-6 sm:mt-8 underline font-semibold
                transition-colors duration-300"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
