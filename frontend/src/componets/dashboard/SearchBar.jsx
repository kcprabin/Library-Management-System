import React from 'react'

const SearchBar = () => {
  return (
    <div className="flex flex-col ">
      
      <h2 className="text-lg font-semibold text-gray-700">
        Search Books
      </h2>

      <div className="flex ">
        <input
          type="text"
          placeholder="Search by book name, author..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

    </div>
  )
}

export default SearchBar
