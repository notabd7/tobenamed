import React from 'react'

export default function SummaryComponent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Summary of Your Study Materials</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Key Points</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>The American Revolution began in 1765 due to tensions between American colonists and the British government.</li>
          <li>Major events include the Boston Tea Party (1773) and the signing of the Declaration of Independence (1776).</li>
          <li>Key figures: George Washington, Thomas Jefferson, and Benjamin Franklin.</li>
          <li>The war ended in 1783 with the Treaty of Paris, recognizing American independence.</li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Timeline</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>1765: Stamp Act imposed by British Parliament</li>
          <li>1773: Boston Tea Party</li>
          <li>1775: Battles of Lexington and Concord</li>
          <li>1776: Declaration of Independence signed</li>
          <li>1781: Battle of Yorktown (major American victory)</li>
          <li>1783: Treaty of Paris ends the war</li>
        </ol>
      </div>
    </div>
  )
}