
import ReactMarkdown from 'react-markdown'; // You'll need to install this: npm install react-markdown

export default function Revision({ revisionData }) {
  if (!revisionData) {
    return null;
  }

  const { revision, formattedRevision } = revisionData;

  return (
    <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
      <h4 className="text-lg font-semibold mb-2">Revision Guide</h4>
      <ReactMarkdown className="prose">
        {formattedRevision}
      </ReactMarkdown>
      {/* Alternatively, if you prefer to use the JSON data directly: */}
      {/*
      <h5 className="font-medium">{revision.subTopic}</h5>
      <p className="mt-2">{revision.message}</p>
      <h6 className="mt-3 font-medium">Strategies to Improve:</h6>
      <ul className="list-disc list-inside">
        {revision.strategies.map((strategy, index) => (
          <li key={index}>{strategy}</li>
        ))}
      </ul>
      */}
    </div>
  );
}