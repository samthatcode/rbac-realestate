import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [], // Changed back to an array
    description: "",
  });
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      setNewRole({
        name: "",
        permissions: [],
        description: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  useEffect(() => {
    // When editingRole changes, update the newRole state with the current data for the editing role
    if (editingRole) {
      setNewRole({
        name: editingRole.name,
        permissions: editingRole.permissions,
        description: editingRole.description,
      });
    }
  }, [editingRole]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        "https://surefinders-backend.onrender.com/api/roles",
        { withCredentials: true }
      );
      setRoles(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch roles");
    }
  };

  const createRole = async () => {
    setIsCreatingRole(true);
    try {
      const response = await axios.post(
        "https://surefinders-backend.onrender.com/api/roles",
        newRole,
        { withCredentials: true }
      );
      const createdRole = response.data.data;
      toast.success("Role created successfully");
      setRoles([...roles, createdRole]);
      setNewRole({
        name: "",
        permissions: [],
        description: "",
      });
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("Failed to create role");
    } finally {
      setIsCreatingRole(false);
    }
  };

  const updateRole = async (id) => {
    // console.log("Role ID:", id);
    // console.log("Roles:", roles);
    const roleToUpdate = roles.find((role) => role._id === id);

    if (!roleToUpdate) {
      console.error("Role not found:", id);
      toast.error("Role not found");
      return;
    }
    try {
      const response = await axios.put(
        `https://surefinders-backend.onrender.com/api/roles/${id}`,
        editRole,
        { withCredentials: true }
      );
      console.log("Server response:", response.data);
      // Manually update the roles state to include the updated role
      setRoles(roles.map((role) => (role._id === id ? editRole : role)));
      toast.success("Role updated successfully");
      setIsFormSubmitted(true);
      // Reset the form
      setEditRole({
        name: "",
        permissions: [],
        description: "",
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const openModal = (role) => {
    setEditingRole(role);
    setEditRole({
      name: role.name,
      permissions: [...role.permissions],
      description: role.description,
    });
    setIsModalOpen(true);
  };

  const deleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(
          `https://surefinders-backend.onrender.com/api/roles/${id}`,
          { withCredentials: true }
        );
        setRoles((prevRoles) => prevRoles.filter((role) => role._id !== id)); // Remove the deleted role from the roles state
        toast.success("Role deleted successfully");
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error("Failed to delete role");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 bg-slate-100">
        <h2 className="text-2xl font-semibold my-4">Role Management</h2>
        <div className="my-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createRole();
            }}
            className="mb-4 mx-auto bg-slate-200 p-6 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label
                  htmlFor="rolename"
                  className="block font-medium mb-1 text-gray-700"
                >
                  Role Name:
                </label>
                <input
                  type="text"
                  placeholder="Role Name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md focus:ring-blue focus:border-blue sm:text-sm px-3 py-2 "
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block font-medium mb-1 text-gray-700"
                >
                  Role Description:
                </label>
                <input
                  type="text"
                  placeholder="Role Description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md focus:ring-blue focus:border-blue sm:text-sm px-3 py-2 "
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="permissions"
                  className="block font-medium mb-1 text-gray-700"
                >
                  Role Permissions:
                </label>
                <textarea
                  placeholder="Type permissions here, separated by commas..."
                  value={newRole.permissions.join(", ")}
                  onChange={(e) => {
                    const permissions = e.target.value
                      .split(",")
                      .map((permission) => permission.trim());
                    setNewRole({ ...newRole, permissions });
                  }}
                  className="w-full border-gray-300 rounded-md focus:ring-blue focus:border-blue sm:text-sm px-3 py-2 "
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isCreatingRole}
                className="bg-primary hover:bg-blue text-white font-bold py-2 w-full px-4 rounded"
              >
                {isCreatingRole ? "Creating Role..." : "Create Role"}
              </button>
            </div>
          </form>
        </div>
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Permissions</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td className="border px-4 py-2">{role.name}</td>
                <td className="border px-4 py-2">{role.description}</td>
                <td className="border px-4 py-2 ">
                  {role.permissions.join(", ")}
                </td>
                <td className="border px-4 py-2 flex justify-between">
                  <button
                    onClick={() => openModal(role)}
                    className="text-blue-500 px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRole(role._id)}
                    className="text-red-500 px-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto my-4"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-slate-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 mb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Edit Role
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateRole(editingRole._id);
                    }}
                    className="mb-4 mx-auto bg-slate-200 p-6 rounded-lg shadow-md"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block font-medium mb-1 text-gray-700"
                      >
                        Role Name:
                      </label>
                      <input
                        type="text"
                        placeholder="Role Name"
                        value={editRole.name}
                        onChange={(e) =>
                          setEditRole({ ...editRole, name: e.target.value })
                        }
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 "
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block font-medium mb-1 text-gray-700"
                      >
                        Role Description:
                      </label>
                      <input
                        type="text"
                        placeholder="Role Description"
                        value={editRole.description}
                        onChange={(e) =>
                          setEditRole({
                            ...editRole,
                            description: e.target.value,
                          })
                        }
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 "
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="permissions"
                        className="block font-medium mb-1 text-gray-700"
                      >
                        Role Permissions:
                      </label>
                      <textarea
                        placeholder="Type permissions here, separated by commas..."
                        value={editRole.permissions.join(", ")}
                        onChange={(e) => {
                          const permissions = e.target.value
                            .split(",")
                            .map((permission) => permission.trim());
                          setEditRole({ ...editRole, permissions });
                        }}
                        className="border p-2 rounded mr-2"
                        rows="4"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="p-2 bg-primary text-white font-bold mt-2 w-full border-gray-300 rounded-md hover:bg-blue focus:border-blue-500 sm:text-sm px-3 py-2 "
                    >
                      Update Role
                    </button>
                  </form>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full flex justify-center rounded-md border font-semibold border-transparent shadow-sm px-4 py-2 my-4 mt-4 bg-red text-base text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoleManagement;
