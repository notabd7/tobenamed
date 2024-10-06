import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { fetchResources } from './fetchResources';
import axios from 'axios';

export default function QuizComponent() {
  const location = useLocation();
  const quizData = location.state?.quizData || [];
  console.log('quiz baby', quizData)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [revisionData, setRevisionData] = useState(null)
  const [resources, setResources] = useState([])
  const [resourceError, setResourceError] = useState(null)


  const handleAnswerClick = (selectedOption) => {
    if (isAnswerChecked) return; // Prevent selecting another answer after checking
    setSelectedAnswer(selectedOption)
    setIsAnswerChecked(true)
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    } else {
      setWrongAnswers([...wrongAnswers, {
        question: quizData[currentQuestion].question,
        user_response: selectedOption,
        correct_response: quizData[currentQuestion].correctAnswer
      }])
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
      sendRevisionRequest()
    }
  }

  const sendRevisionRequest = async () => {
    try {
      const response = await axios.post('http://localhost:3000/revision', { wrongAnswers });
      console.log('Revision Data:', response.data); // Log the revision data
      setRevisionData(response.data);

      if (response.data && response.data.subTopic) {
        try {
          const fetchedResources = await fetchResources(response.data.subTopic);
          console.log('Fetched Resources:', fetchedResources); // Log the fetched resources
          if (Array.isArray(fetchedResources)) {
            setResources(fetchedResources);
          } else {
            console.error('Fetched resources is not an array:', fetchedResources);
            setResourceError('Unable to load resources. Please try again later.');
          }
        } catch (resourceError) {
          console.error('Error fetching resources:', resourceError);
          setResourceError('Failed to fetch resources. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error sending revision request:', error);
      setRevisionData(null);
      setResourceError('Failed to generate revision guide. Please try again later.');
    }
  }
  
  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setWrongAnswers([])
    setRevision('')
    setRevisionData(null) // Reset revision data
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
            {revisionData && (
              <div className="mt-4 text-left">
                <h4 className="font-semibold">Revision Guide: {revisionData.subTopic}</h4>
                <p className="mt-2">{revisionData.message}</p>
                <h5 className="font-semibold mt-3">Strategies to Improve:</h5>
                <ul className="list-disc list-inside">
                  {revisionData.strategies.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
                {resources.length > 0 ? (
                  <div className="mt-4">
                    <h5 className="font-semibold">Additional Resources:</h5>
                    <ul className="list-disc list-inside">
                      {resources.map((resource, index) => (
                        <li key={index}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : resourceError ? (
                  <p className="mt-4 text-red-500">{resourceError}</p>
                ) : (
                  <p className="mt-4">No additional resources found.</p>
                )}
              </div>
            )}
            <button
              onClick={restartQuiz}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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