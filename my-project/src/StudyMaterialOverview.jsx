import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SummaryComponent from './SummaryComponent';
import FlashcardsComponent from './FlashcardsComponent';
import QuizComponent from './QuizComponent';

export default function StudyMaterialOverview() {
  const [activeTab, setActiveTab] = useState('summary');
  const location = useLocation();
  const navigate = useNavigate();
  const { summaryData, flashCardData, quizData, isLoading } = location.state || {};

  useEffect(() => {
    console.log("Summary Data:", summaryData);
    console.log("Flashcards Data:", flashCardData);
    console.log("Quiz Data:", quizData);
    console.log("Is Loading:", isLoading);
  }, [summaryData, flashCardData, quizData, isLoading]);

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Mock projects data
  const projects = [
    { id: 1, name: 'History 101', files: 3 },
    { id: 2, name: 'Biology Basics', files: 5 },
    { id: 3, name: 'Math Fundamentals', files: 2 },
    { id: 4, name: 'Literature Review', files: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-orange-500 mb-6">StudyAI</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left py-2 px-4 rounded bg-orange-100 transition-colors flex items-center"
                  onClick={() => openTab('summary')}
                >
                  <span className="mr-2">📊</span> Summary
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left py-2 px-4 rounded hover:bg-orange-100 transition-colors flex items-center"
                  onClick={() => openTab('flashcards')}
                >
                  <span className="mr-2">🗂️</span> Flashcards
                </button>
              </li>
              <li>
                <button
                  className="w-full text-left py-2 px-4 rounded hover:bg-orange-100 transition-colors flex items-center"
                  onClick={() => openTab('test-yourself')}
                >
                  <span className="mr-2">✍️</span> Test Yourself
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center">
              <p className="text-xl font-semibold">Loading your study materials...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-5 rounded-lg shadow-md mb-6">
                {activeTab === 'summary' && <SummaryComponent summaryData={summaryData} />}
                {activeTab === 'flashcards' && <FlashcardsComponent flashCardData={flashCardData} />}
                {activeTab === 'test-yourself' && <QuizComponent quizData={quizData} />}
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-gray-600">{project.files} files</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}