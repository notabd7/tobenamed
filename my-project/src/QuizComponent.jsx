import { useState } from 'react'
import { useLocation } from 'react-router-dom';

export default function QuizComponent() {
  const location = useLocation();
  const quizData = location.state?.quizData || [];
  console.log('quiz baby', quizData)

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

  const getButtonColor = (option) => {
    if (!isAnswerChecked) return 'bg-gray-100 hover:bg-gray-200'
    if (option === quizData[currentQuestion].correctAnswer) {
      return 'bg-green-500 text-white'
    }
    if (option === selectedAnswer) return 'bg-red-500 text-white'
    return 'bg-gray-100'
  }

  if (quizData.length === 0) {
    return <div>No quiz data available. Please upload a file to generate a quiz.</div>
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
                  onClick={() => handleAnswerClick(option)}
                  className={`w-full p-2 text-left rounded transition-colors ${getButtonColor(option)}`}
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