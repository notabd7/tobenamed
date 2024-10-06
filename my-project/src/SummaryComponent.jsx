import { useLocation } from 'react-router-dom';

export default function SummaryComponent() {
  const location = useLocation();
  const { summaryData } = location.state || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Summary of Your Study Materials</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Summary</h3>
        {summaryData ? (
          <p className="text-gray-600 whitespace-pre-wrap">{summaryData}</p>
        ) : (
          <p className="text-gray-500 italic">No summary available. Please upload a file to generate a summary.</p>
        )}
      </div>
    </div>
  );
}