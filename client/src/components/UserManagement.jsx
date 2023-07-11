import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select a user and a role");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `/api/admin/users/${selectedUser}/assign-role`,
        {
          role: selectedRole,
        }
      );

      if (response.status === 200) {
        toast.success("Role assigned successfully");
        // Update the UI, if needed, based on the response data
        // For example, you can update the user's role in the local state or re-fetch the users list
        // ...
      } else {
        toast.error("Failed to assign role");
      }
      // You can update the UI accordingly if needed
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign role");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="flex flex-col mb-4">
        <label htmlFor="user" className="font-medium mb-2">
          Select User:
        </label>
        <select
          id="user"
          className="border border-gray-300 rounded-md py-2 px-3"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-4">
        <label htmlFor="role" className="font-medium mb-2">
          Select Role:
        </label>
        <select
          id="role"
          className="border border-gray-300 rounded-md py-2 px-3"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="marketer">Marketer</option>
          <option value="user">User</option>
          {/* Add other roles here */}
        </select>
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
        onClick={assignRole}
        disabled={!selectedUser || !selectedRole || loading}
      >
        {loading ? "Assigning Role..." : "Assign Role"}
      </button>
    </div>
  );
};

export default UserManagement;
