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
      console.log('Revision Data:', response.data);
      setRevisionData(response.data);

      if (response.data && response.data.subTopic) {
        try {
          const fetchedResources = await fetchResources(response.data.subTopic);
          console.log('Fetched Resources:', fetchedResources);
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
    setRevisionData(null)
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
    return <div className="text-2xl">No quiz data available. Please upload a file to generate a quiz.</div>
  }

  return (
    <div className="space-y-9">
      <h2 className="text-4xl font-bold text-gray-800">Test Yourself!</h2>
      <div className="bg-white p-9 rounded-xl shadow-lg">
        {showScore ? (
          <div className="text-center">
            <h3 className="text-3xl font-semibold mb-6">You scored {score} out of {quizData.length}</h3>
            {revisionData && (
              <div className="mt-6 text-left text-xl">
                <h4 className="text-2xl font-semibold">Revision Guide: {revisionData.subTopic}</h4>
                <p className="mt-4">{revisionData.message}</p>
                <h5 className="text-2xl font-semibold mt-6">Strategies to Improve:</h5>
                <ul className="list-disc list-inside mt-4">
                  {revisionData.strategies.map((strategy, index) => (
                    <li key={index} className="mb-2">{strategy}</li>
                  ))}
                </ul>
                {resources.length > 0 ? (
                  <div className="mt-6">
                    <h5 className="text-2xl font-semibold">Additional Resources:</h5>
                    <ul className="list-disc list-inside mt-4">
                      {resources.map((resource, index) => (
                        <li key={index} className="mb-2">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-custom-orange-500 hover:underline">
                            {resource.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : resourceError ? (
                  <p className="mt-6 text-red-500">{resourceError}</p>
                ) : (
                  <p className="mt-6">No additional resources found.</p>
                )}
              </div>
            )}
            <button
              onClick={restartQuiz}
              className="mt-8 px-6 py-3 text-xl bg-custom-red-500 text-white rounded-lg hover:bg-custom-orange-500 transition-colors"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-lg text-gray-500">Question {currentQuestion + 1} of {quizData.length}</span>
            </div>
            <h3 className="text-3xl font-semibold mb-6">{quizData[currentQuestion].question}</h3>
            <div className="space-y-4">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`w-full p-4 text-xl text-left rounded-lg transition-colors ${getButtonColor(option)}`}
                  disabled={isAnswerChecked}
                >
                  {option}
                </button>
              ))}
            </div>
            {isAnswerChecked && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 text-xl bg-custom-red-500 text-white rounded-lg hover:bg-custom-orange-500 transition-colors"
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