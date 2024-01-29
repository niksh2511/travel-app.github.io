import React from "react";



const Table = ({ headers, data, onBookClick }) => (
  <table className="min-w-64 border border-collapse">
    <thead>
      <tr>
        {headers.map((header) => (
          <th className="border p-2" key={header}>
            {header}
          </th>
        ))}
        {onBookClick && <th className="border p-1">Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((flight, index) => (
        <tr key={index} className="border">
          {headers.map((header, index) => (
            <td key={index} className="border p-2">
              {flight[header]}
            </td>
          ))}
          {onBookClick && (
            <td className="border p-1">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                onClick={() => onBookClick(flight.flightID)}
                disabled={flight["availableSeats"] === 0}
              >
                Book
              </button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
