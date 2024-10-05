import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const flashcardsData = [
  { question: "When did the American Revolution begin?", answer: "1765" },
  { question: "What was the significance of the Boston Tea Party?", answer: "It was a protest against British taxation policies" },
  { question: "Who was the primary author of the Declaration of Independence?", answer: "Thomas Jefferson" },
  { question: "When was the Declaration of Independence signed?", answer: "July 4, 1776" },
  { question: "What treaty ended the American Revolutionary War?", answer: "The Treaty of Paris (1783)" },
]

export default function FlashcardsComponent() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(0)

  const nextCard = () => {
    setDirection(1)
    setIsFlipped(false)
    setCurrentCard((prev) => (prev + 1) % flashcardsData.length)
  }

  const prevCard = () => {
    setDirection(-1)
    setIsFlipped(false)
    setCurrentCard((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length)
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        zIndex: 0,
      }
    },
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        zIndex: 0,
      }
    },
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Flashcards</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-500">Card {currentCard + 1} of {flashcardsData.length}</span>
        </div>
        <div className="relative h-48 w-full perspective-1000">
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
                  {isFlipped ? flashcardsData[currentCard].answer : flashcardsData[currentCard].question}
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
  )
}