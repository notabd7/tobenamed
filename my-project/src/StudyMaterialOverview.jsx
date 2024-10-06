import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryComponent from './SummaryComponent'
import FlashcardsComponent from './FlashcardsComponent'
import QuizComponent from './QuizComponent'

export default function StudyMaterialOverview() {
  const [activeTab, setActiveTab] = useState('summary')
  const location = useLocation()
  const { summaryData, flashcardsData, quizData, isLoading } = location.state || {}

  useEffect(() => {
    console.log("Summary Data:", summaryData)
    console.log("Flashcards Data:", flashcardsData)
    console.log("Quiz Data:", quizData)
    console.log("Is Loading:", isLoading)
  }, [summaryData, flashcardsData, quizData, isLoading])

  const openTab = (tabName) => {
    setActiveTab(tabName)
  }

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'test-yourself', label: 'Test yourself!' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12">
      <div className="max-w-7xl w-full relative z-10">
        <div className="flex justify-start relative top-0 left-5 z-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-12 py-2 border-10 text-xl border-gray-300 rounded-t-md mr-1 cursor-pointer z-5 transition-all ml-2 duration-300 ease-in-out ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 font-semibold z-10 border-b-0'
                  : 'bg-custom-red-500 text-white hover:bg-custom-orange-500'
              }`}
              onClick={() => openTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md z-10" style={{ minHeight: '800px', marginTop: '-2px' }}>
          <div className="text-xl">
            {activeTab === 'summary' && <SummaryComponent summaryData={summaryData} />}
            {activeTab === 'flashcards' && <FlashcardsComponent flashcardsData={flashcardsData} />}
            {activeTab === 'test-yourself' && <QuizComponent quizData={quizData} />}
          </div>
        </div>
      </div>
    </div>
  )
}