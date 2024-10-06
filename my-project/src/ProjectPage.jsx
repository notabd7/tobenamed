import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SummaryComponent from './SummaryComponent'
import FlashcardsComponent from './FlashcardsComponent'
import QuizComponent from './QuizComponent'

export default function ProjectPage() {
  const [activeTab, setActiveTab] = useState('summary')
  const [project, setProject] = useState(null)
  const { projectId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // In a real application, you would fetch the project data here
    // For now, we'll use mock data
    const mockProject = {
      id: projectId,
      name: `Project ${projectId}`,
      files: [
        { name: 'File 1', content: 'Content 1' },
        { name: 'File 2', content: 'Content 2' },
      ]
    }
    setProject(mockProject)
  }, [projectId])

  const openTab = (tabName) => {
    setActiveTab(tabName)
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: '📄' },
    { id: 'flashcards', label: 'Flashcards', icon: '🗂️' },
    { id: 'test-yourself', label: 'Test yourself!', icon: '✏️' },
  ]

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 text-orange-500 hover:text-orange-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{project.name}</h2>
        
        {/* Tabs */}
        <div className="flex mb-6 bg-white rounded-lg shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-orange-100'
              }`}
              onClick={() => openTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'summary' && <SummaryComponent files={project.files} />}
          {activeTab === 'flashcards' && <FlashcardsComponent files={project.files} />}
          {activeTab === 'test-yourself' && <QuizComponent files={project.files} />}
        </div>
      </div>
    </div>
  )
}