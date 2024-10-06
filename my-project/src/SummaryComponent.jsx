import { useLocation } from 'react-router-dom';

export default function SummaryComponent() {
  const location = useLocation();
  const { summaryData } = location.state || {};

  return (
    <div className="space-y-9">
      <h2 className="text-4xl font-bold text-gray-800">Summary of Your Study Materials</h2>
      <div className="bg-white p-9 rounded-xl shadow-lg">
        {summaryData ? (
          <p className="text-xl text-gray-600 whitespace-pre-wrap leading-relaxed">
            {summaryData}
          </p>
        ) : (
          <p className="text-2xl text-gray-500 italic">
            No summary available. Please upload a file to generate a summary.
          </p>
        )}
      </div>
    </div>
  );
}