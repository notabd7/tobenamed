import React, { useState } from 'react'

const quizData = [
  {
    question: "When did the American Revolution begin?",
    options: ["1765", "1776", "1783", "1789"],
    correctAnswer: 0
  },
  {
    question: "Who was NOT a key figure in the American Revolution?",
    options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "Abraham Lincoln"],
    correctAnswer: 3
  },
  {
    question: "What event marked the beginning of open armed conflict?",
    options: ["Boston Tea Party", "Signing of Declaration of Independence", "Battles of Lexington and Concord", "Treaty of Paris"],
    correctAnswer: 2
  },
  {
    question: "When was the Declaration of Independence signed?",
    options: ["July 2, 1776", "July 4, 1776", "August 2, 1776", "September 3, 1783"],
    correctAnswer: 1
  },
]

export default function QuizComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)

  const handleAnswerClick = (selectedOption) => {
    if (isAnswerChecked) return; // Prevent selecting another answer after checking

    setSelectedAnswer(selectedOption)
    setIsAnswerChecked(true)

    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer(null)
      setIsAnswerChecked(false)
    } else {
      setShowScore(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
  }

  const getButtonColor = (index) => {
    if (!isAnswerChecked) return 'bg-gray-100 hover:bg-gray-200'
    if (index === quizData[currentQuestion].correctAnswer) return 'bg-green-500 text-white'
    if (index === selectedAnswer) return 'bg-red-500 text-white'
    return 'bg-gray-100'
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Test Yourself!</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {showScore ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">You scored {score} out of {quizData.length}</h3>
            <button
              onClick={restartQuiz}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {quizData.length}</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">{quizData[currentQuestion].question}</h3>
            <div className="space-y-2">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full p-2 text-left rounded transition-colors ${getButtonColor(index)}`}
                  disabled={isAnswerChecked}
                >
                  {option}
                </button>
              ))}
            </div>
            {isAnswerChecked && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}