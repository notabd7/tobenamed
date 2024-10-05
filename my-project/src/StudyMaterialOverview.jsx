import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryComponent from './SummaryComponent'
import FlashcardsComponent from './FlashcardsComponent'
import QuizComponent from './QuizComponent'

export default function StudyMaterialOverview() {
  const [activeTab, setActiveTab] = useState('summary')
  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.filesUploaded) {
      console.log(`${location.state.filesUploaded} files were uploaded`)
      // Here you would typically fetch the processed data for these files
    }
  }, [location])

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
      <div className="max-w-4xl w-full relative z-10">
        <div className="flex justify-start relative top-0 left-5 z-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-5 py-2 border-2 border-gray-300 rounded-t-md mr-2.5 text-sm cursor-pointer z-5 transition-all duration-300 ease-in-out ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 font-semibold z-10 border-b-0'
                  : 'bg-red-600 text-white opacity-85 hover:opacity-100'
              }`}
              onClick={() => openTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md z-10">
          {activeTab === 'summary' && <SummaryComponent />}
          {activeTab === 'flashcards' && <FlashcardsComponent />}
          {activeTab === 'test-yourself' && <QuizComponent />}
        </div>
      </div>
    </div>
  )
}