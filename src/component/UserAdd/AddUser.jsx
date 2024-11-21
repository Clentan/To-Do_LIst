import React, { useState } from 'react';

export default function AddUserAndColumn() {
  const [userData, setUserData] = useState({
    Name: '',
    Email: '',
    Role: '',
    Status: 'active', // Default status
  });

  const [columnData, setColumnData] = useState({
    Name: '',
    Email: '',
    Role: '',
    Status: 'active', // Default status
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update both `userData` and `columnData` with the same input
    setUserData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    
    setColumnData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit to `users` endpoint
      const userResponse = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Submit to `columns` endpoint
      const columnResponse = await fetch('http://localhost:4000/columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(columnData),
      });

      if (userResponse.ok && columnResponse.ok) {
        alert('Data added to both endpoints successfully');
        setUserData({
          Name: '',
          Email: '',
          Role: '',
          Status: 'active',
        });
        setColumnData({
          Name: '',
          Email: '',
          Role: '',
          Status: 'active',
        }); // Reset both states
      } else {
        alert('Failed to add data to one or both endpoints');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the data');
    }
  };

  // Function to determine the color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'; // Green for active
      case 'pause':
        return 'bg-red-500'; // Red for pause
      case 'vacation':
        return 'bg-yellow-500'; // Yellow for vacation
      default:
        return 'bg-gray-200'; // Default color if undefined
    }
  };

  return (
    <div className="flex items-center justify-center py-6 bg-blue-700">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-950 p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2"
      >
        <h2 className="text-lg font-bold mb-4">Add User and Column Data</h2>
        <div className="flex flex-wrap gap-4">
          <div className="mb-4 w-full sm:w-1/2 lg:w-1/4">
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="Name"
              value={userData.Name}
              onChange={handleInputChange}
              placeholder="Name"
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4 w-full sm:w-1/2 lg:w-1/4">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="Email"
              value={userData.Email}
              onChange={handleInputChange}
              placeholder="Email"
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4 w-full sm:w-1/2 lg:w-1/4">
            <label htmlFor="Role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              id="Role"
              value={userData.Role}
              onChange={handleInputChange}
              placeholder="Role"
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4 w-full sm:w-1/2 lg:w-1/4">
            <label htmlFor="Status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="Status"
              value={userData.Status}
              onChange={handleInputChange}
              className={`mt-1 p-2 border rounded w-full ${getStatusColor(userData.Status)}`}
            >
              <option value="active">Active</option>
              <option value="pause">Pause</option>
              <option value="vacation">Vacation</option>
            </select>
          </div>

          <div className="mb-4 w-full flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 bg-blue-500 text-white rounded w-full sm:w-auto"
            >
              Submit Data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
