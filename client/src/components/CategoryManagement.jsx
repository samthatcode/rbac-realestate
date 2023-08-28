import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    // add other category details here
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      setNewCategory({
        name: "",
        description: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://surefinders-backend.onrender.com/api/categories", { withCredentials: true });
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  const createCategory = async () => {
    setIsCreatingCategory(true);
    try {
      const response = await axios.post("https://surefinders-backend.onrender.com/api/categories", newCategory,{ withCredentials: true });
      const createdCategory = response.data.data;
      toast.success("Category created successfully");
      setCategories([...categories, createdCategory]);
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
      setNewCategory({
        name: "",
        description: "",
      });
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    const categoryToUpdate = categories.find((category) => category._id === id);
    if (!categoryToUpdate) {
      console.error("Category not found:", id);
      toast.error("Category not found");
      return;
    }
    try {
      await axios.put(`https://surefinders-backend.onrender.com/api/categories/${id}`, updatedCategory, { withCredentials: true });
      fetchCategories();
      toast.success("Category updated successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category");
    }
  };

  const openModal = (category) => {
    setEditingCategory(category);
    setNewCategory(category);
    setIsModalOpen(true);
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`https://surefinders-backend.onrender.com/api/categories/${id}`, { withCredentials: true });
        fetchCategories();
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 bg-slate-100">
        <h2 className="text-2xl font-semibold my-4">Category Management</h2>
        <div className="my-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createCategory();
            }}
          >
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="border p-2 rounded mr-2 capitalize"
            />
            <input
              type="text"
              placeholder="Category Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="border p-2 rounded mr-2 capitalize"
            />
            <button
              type="submit"
              disabled={isCreatingCategory}
              className="p-2 bg-primary text-white rounded"
            >
              {isCreatingCategory ? "Creating Category..." : "Create Category"}
            </button>
          </form>
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="border px-4 py-2 capitalize">{category.name}</td>
                <td className="border px-4 py-2 capitalize">
                  {category.description}
                </td>
                <td className="border px-4 py-2 flex justify-between">
                  <button
                    onClick={() => openModal(category)}
                    className="text-primary px-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="text-red px-2"
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
                    Edit Category
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateCategory(editingCategory._id, newCategory);
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="border p-2 rounded mr-2 mt-2 capitalize"
                    />
                    <input
                      type="text"
                      placeholder="Category Description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      className="border p-2 rounded mr-2 mt-2 capitalize"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-blue-500 text-white rounded mt-2"
                    >
                      Update Category
                    </button>
                  </form>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full flex justify-center rounded-md border font-semibold border-transparent shadow-sm px-4 py-2 my-4 mt-4 bg-red text-base text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default CategoryManagement;
