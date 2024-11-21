import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Input,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { SearchIcon } from "./SearchIcon";
import { columns } from "./data"; // Assuming columns are defined in this file


const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function CombinedApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [userData, setUserData] = useState({
    Name: "",
    Email: "",
    Role: "",
    Status: "active", // Default status
  });

  const [columnData, setColumnData] = useState({
    Name: "",
    Email: "",
    Role: "",
    Status: "active", // Default status
  });



  // Fetch users data when the component mounts
  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // Set users state with the fetched data
        setFilteredUsers(data); // Initialize filteredUsers with fetched data
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  
  // Function to submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const isEditMode = userData.id; // Check if it's an existing user or new
  
      // If in edit mode, update the user data
      const method = isEditMode ? "PUT" : "POST"; // Use PUT for updating
      const endpoint = isEditMode
        ? `http://localhost:4000/users/${userData.id}`
        : "http://localhost:4000/users";
  
      const userResponse = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      // Handle the response for the user
      if (userResponse.ok) {
        if (!isEditMode) {
          alert("Data added to the users endpoint successfully");
        } else {
          alert("Data updated in the users endpoint successfully");
        }
  
        setUserData({
          Name: "",
          Email: "",
          Role: "",
          Status: "active",
        }); // Reset the form after submission
        setColumnData({
          Name: "",
          Email: "",
          Role: "",
          Status: "active",
        }); // Reset column data
      } else {
        alert("Failed to submit data to the users endpoint");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the data");
    }
  };

  const handleEdit = (user) => {
    setUserData({
      id: user.id,
      Name: user.Name,
      Email: user.Email,
      Role: user.Role,
      Status: user.Status,
    });
    setColumnData({
      Name: user.Name,
      Email: user.Email,
      Role: user.Role,
      Status: user.Status,
    });
  };
  
  


  // Handle input change for the form
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

  // Handle the search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to all users if no search query
    }
  };

  // Handle delete action
 

  // Render cell for each column
  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.avatar }}
              description={user.email}
              name={cellValue}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {user.team}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit user">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={() => handleEdit(user)} // Pass user data to handleEdit
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete user">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => handleDelete(user.id)} // Delete on click
        >
          <DeleteIcon />
        </span>
      </Tooltip>

              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDelete(user.id)} // Delete on click
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [users, filteredUsers]
  );

  return (
    <div className="p-4">
      {/* Add User and Column Form */}
      <div className="flex items-center justify-center py-6 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2"
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

      {/* Search Input */}
      <div className="mb-4 flex items-center gap-2">
        <Input
          clearable
          underlined
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          contentLeft={<SearchIcon />}
        />
      </div>

      {/* Users Table */}
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredUsers}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
