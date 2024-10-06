import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function FlashcardsComponent() {
  const location = useLocation();
  const { flashcardsData: rawFlashcardsData } = location.state || {};
  
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (rawFlashcardsData) {
      const processedFlashcards = rawFlashcardsData.split('\n').filter(card => card.trim() !== '');
      console.log("is it here?", processedFlashcards)
      setFlashcards(processedFlashcards);
    }
  }, [rawFlashcardsData]);

  const nextCard = () => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    }),
  };

  if (flashcards.length === 0) {
    return <div className="text-center text-gray-500">No flashcards available. Please upload a file to generate flashcards.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Flashcards</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-500">Card {currentCard + 1} of {flashcards.length}</span>
        </div>
        <div className="relative w-64 h-64 mx-auto perspective-1000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentCard}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full"
            >
              <motion.div
                className="w-full h-full bg-gray-100 rounded-lg shadow-md cursor-pointer flex items-center justify-center p-4"
                onClick={flipCard}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-xl text-center">
                  {flashcards[currentCard]}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={prevCard}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextCard}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}