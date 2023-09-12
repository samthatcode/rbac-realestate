import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    // add other user details here
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://surefinders-backend.onrender.com/api/users",
        { withCredentials: true }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  const createUser = async () => {
    setIsCreatingUser(true);
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/signup",
        newUser,
        { withCredentials: true }
      );
      const createdUser = response.data.data;
      toast.success("User created successfully");
      // Update the list of users by adding the created user to the existing list
      setUsers([...users, createdUser]);
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsCreatingUser(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    }
  };

  // When updating a user, fetch the full user object from the users array
  const updateUser = async (id, updatedUser) => {
    const userToUpdate = users.find((user) => user._id === id);
    if (!userToUpdate) {
      console.error("User not found:", id);
      toast.error("User not found");
      return;
    }
    try {
      await axios.put(
        `https://surefinders-backend.onrender.com/api/users/${id}`,
        updatedUser,
        { withCredentials: true }
      );
      fetchUsers();
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const openModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `https://surefinders-backend.onrender.com/api/users/${id}`,
          { withCredentials: true }
        );
        fetchUsers();
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
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
        `https://surefinders-backend.onrender.com/api/users/${selectedUser}/assign-role`,
        {
          role: selectedRole,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Role assigned successfully");
        // Update the user's role in the local state
        const updatedUsers = users.map((user) =>
          user._id === selectedUser ? { ...user, role: selectedRole } : user
        );
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white my-20">
      <div className="rounded-lg bg-slate-50 p-10 shadow-xl">
        <h2 className="text-2xl font-semibold ">User Management</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createUser();
          }}
          className="flex flex-col py-10"
        >
          <div className="flex items-center justify-between w-full md:w-auto gap-4 my-5">
            <input
              required
              type="text"
              placeholder="First name"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              className="border p-2 mb-2 w-full md:w-1/2 rounded-md capitalize"
            />
            <input
              required
              type="text"
              placeholder="Last name"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              className="border p-2 mb-2 w-full md:w-1/2 rounded-md capitalize"
            />
          </div>
          <div className="flex items-center justify-between w-full md:w-auto gap-4 my-5">
            <input
              required
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="border p-2 mb-2 w-full md:w-1/2 rounded-md"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border p-2 mb-2 w-full md:w-1/2 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-blue font-bold text-white p-2 rounded-md ml-auto w-full"
            disabled={isCreatingUser}
          >
            {isCreatingUser ? "Creating User..." : "Create User"}
          </button>
        </form>

        <table className="table-auto w-full mb-4">
          <thead>
            <tr className="text-teal">
              <th className="border px-4 py-2">S/N</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Roles</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2 flex justify-between">
                  <button
                    onClick={() => openModal(user)}
                    className="text-primary hover:text-blue font-bold bg-slate-100 px-2 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red font-bold bg-slate-100 px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-20 rounded-lg bg-slate-50 p-10 shadow-xl">
        <h2 className="text-2xl font-semibold my-4">Roles Management</h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="user" className="font-medium mb-2">
            Select User:
          </label>
          <select
            id="user"
            className="border border-gray-300 rounded-md py-2 px-3 bg-white"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user, index) => (
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
            className="border border-gray-300 rounded-md py-2 px-3 bg-white"
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
          className={`p-2 py-2 px-4 rounded-md ${
            loading ? "bg-gray-500" : "bg-green"
          } text-white cursor-pointer`}
          onClick={assignRole}
          disabled={!selectedUser || !selectedRole || loading}
        >
          {loading ? "Assigning Role..." : "Assign Role"}
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUser(editingUser._id, editingUser);
                  setIsModalOpen(false);
                }}
                className="bg-slate-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
              >
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-teal"
                      id="modal-title"
                    >
                      Edit User
                    </h3>
                    <div className="mt-2">{/* Your form inputs */}</div>
                  </div>
                </div>
                <label htmlFor="firstName" className="block mb-2">
                  First Name:
                  <input
                    type="text"
                    id="firstName"
                    placeholder="First name"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    }
                    className="border p-2 w-full"
                  />
                </label>
                <label htmlFor="lastName" className="block mb-2">
                  Last Name:
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last name"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    }
                    className="border p-2 w-full"
                  />
                </label>
                <label htmlFor="email" className="block mb-2">
                  Email:
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    className="border p-2 w-full"
                  />
                </label>
                <label htmlFor="password" className="block mb-2">
                  Password:
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={editingUser.password}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        password: e.target.value,
                      })
                    }
                    className="border p-2 w-full"
                  />
                </label>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-blue focus:outline-none focus:border-blue-700 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      Save
                    </button>
                  </span>
                  <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
