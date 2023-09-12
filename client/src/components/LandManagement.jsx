import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const modalStyles = {
  content: {
    height: "500px",
    overflowY: "auto",
  },
};

const ITEMS_PER_PAGE = 5;

const LandManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [lands, setLands] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: [],
    categoryId: "",
    acreage: "",
  });
  const [editingLand, setEditingLand] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCreatingLand, setIsCreatingLand] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        images: [],
        categoryId: "",
        acreage: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  const fetchLands = async () => {
    try {
      const response = await axios.get(
        // "/api/lands",
        "https://surefinders-backend.onrender.com/api/lands",
        { withCredentials: true }
      );
      setLands(response.data.data);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          // "/api/categories",
          "https://surefinders-backend.onrender.com/api/categories",
          { withCredentials: true }
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = Math.ceil(lands.length / ITEMS_PER_PAGE);

  const getPageData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return lands.slice(startIndex, endIndex);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "image" || e.target.name === "images") {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setFormData({
        ...formData,
        [e.target.name]: selectedFiles,
        [`${e.target.name}Name`]: selectedFiles.map((file) => file.name),
      });
    } else if (e.target.name === "imageUrl") {
      setFormData({
        ...formData,
        image: e.target.value,
        imageName: "imageUrl",
      });
    } else if (e.target.name === "categoryId") {
      const selectedCategoryId = e.target.value;
      setFormData({
        ...formData,
        categoryId: selectedCategoryId,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const createLand = async () => {
    setIsCreatingLand(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "images") {
          if (Array.isArray(files) && files.length > 0) {
            files.forEach((fileObj, index) => {
              formDataToSend.append("images", fileObj.file, fileObj.name);
            });
          }
        } else if (key !== "imageName" && key !== "imagesName") {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        // "/api/lands",
        "https://surefinders-backend.onrender.com/api/lands",
        formDataToSend,
        { withCredentials: true }
      );
      const createdLand = response.data.data;
      toast.success("Land created successfully");
      setLands([...lands, createdLand]);
      setFiles([]);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        images: [],
        categoryId: "",
        acreage: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create land");
    } finally {
      setIsCreatingLand(false);
    }
    closeModal();
  };

  const updateLand = async (id, updatedLand) => {
    const landToUpdate = lands.find((land) => land._id === id);
    if (!landToUpdate) {
      console.error("Land not found:", id);
      toast.error("Land not found");
      return;
    }
    try {
      let formData = new FormData();
      for (let key in updatedLand) {
        if (key === "images") {
          if (Array.isArray(files) && files.length > 0) {
            files.forEach((fileObj, index) => {
              formData.append("images", fileObj.file, fileObj.name);
            });
          }
        } else {
          formData.append(key, updatedLand[key]);
        }
      }

      await axios.put(
        // `/api/lands/${id}`,
        `https://surefinders-backend.onrender.com/api/lands/${id}`,
        formData,
        { withCredentials: true }
      );

      fetchLands();
      toast.success("Land updated successfully");
      setIsFormSubmitted(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        images: [],
        categoryId: "",
        acreage: "",
      });
    } catch (error) {
      console.error("Failed to update land:", error);
      toast.error(`Failed to update land: ${error.message}`);
    }
  };

  const deleteLand = async (id) => {
    if (window.confirm("Are you sure you want to delete this land?")) {
      try {
        await axios.delete(
          // `/api/lands/${id}`,
          `https://surefinders-backend.onrender.com/api/lands/${id}`,
          { withCredentials: true }
        );
        fetchLands();
        toast.success("Land deleted successfully");
      } catch (error) {
        console.error("Failed to delete land:", error);
        toast.error("Failed to delete land");
      }
    }
  };

  // Define openModal and closeModal functions
  const openModal = (land) => {
    // Extract the properties needed for the form data
    const { title, description, price, location, acreage, categoryId } = land;

    // Create a new object with the extracted properties and set it as the form data
    setFormData({
      title,
      description,
      price,
      location,
      acreage,
      categoryId,
      images: [], // Assuming you want to clear existing images when editing
    });

    setEditingLand(land);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      acreage: "",
      categoryId: "",
      images: [],
    });
    setEditingLand("");
    setModalIsOpen(false);
  };

  const handleFileChange = (e) => {
    // console.log(e.target.files);
    // Get the selected files from the event
    const selectedFiles = e.target.files;
    // Convert the FileList to an array of { file, name } objects
    const filesArray = Array.from(selectedFiles).map((file) => ({
      file,
      name: file.name,
    }));
    // Set the state to hold the selected files
    setFiles(filesArray);
  };

  // Get all number input fields
  const numberInputs = document.querySelectorAll('input[type="number"]');
  // Add event listeners to number input fields
  numberInputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      // Allow only numbers, backspace, and delete key
      if (
        !(
          (e.key >= "0" && e.key <= "9") ||
          e.key === "Backspace" ||
          e.key === "Delete"
        )
      ) {
        e.preventDefault();
      }
    });
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Lands</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLand();
        }}
        className="mb-4 mx-auto bg-slate-100 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block font-medium mb-1 text-gray-700"
            >
              Title
            </label>
            <input
              placeholder="Land Title"
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-medium mb-1 text-gray-700"
            >
              Description
            </label>
            <textarea
              placeholder="Description.."
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block font-medium mb-1 text-gray-700"
            >
              Price
            </label>
            <input
              placeholder="Price"
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block font-medium mb-1 text-gray-700"
            >
              Location
            </label>
            <input
              placeholder="Location"
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="acreage"
              className="block font-medium mb-1 text-gray-700"
            >
              Acreage
            </label>
            <input
              placeholder="Acreage"
              type="number"
              name="acreage"
              id="acreage"
              value={formData.acreage}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="images"
              className="block font-medium mb-1 text-gray-700"
            >
              Images
            </label>
            <input
              type="file"
              multiple
              name="images"
              onChange={handleFileChange}
              value={formData.images}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
            <div>
              <ul>
                {files.map((fileObject, index) => (
                  <li key={index}>{fileObject.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="categoryId"
              className="block font-medium mb-1 text-gray-700"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 bg-white"
            >
              <option className="bg-white">Select a category</option>
              {categories.map((categoryId) => (
                <option key={categoryId._id} value={categoryId._id}>
                  {categoryId.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
              disabled={isCreatingLand}
            >
              {isCreatingLand ? "Creating Land..." : "Create Land"}
            </button>
          </div>
        </div>
      </form>

      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-teal text-white">
              <th className="px-4 py-2">S/N</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPageData().map((land, index) => (
              <tr key={land._id}>
                <td className="border px-4 py-2">
                  {currentPage * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="border px-4 py-2 capitalize">{land.title}</td>
                <td className="border px-4 py-2 text-green font-semibold ">
                  &#x20A6;{land.price?.toLocaleString()}
                </td>
                <td className="border px-4 py-2 capitalize">
                  {land.description}
                </td>
                <td className="border px-4 py-2">{land.categoryId}</td>
                <td className="border px-4 py-2 flex justify-between gap-4">
                  <button
                    onClick={() => openModal(land)}
                    className="text-primary hover:text-blue font-bold bg-slate-100 px-2 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLand(land._id)}
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
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
        >
          {"<<"}
        </button>
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
        >
          {"<"}
        </button>
        <span className="text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
        >
          {">"}
        </button>
        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
        >
          {">>"}
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles} // Apply the modal styles
        className="p-4 mt-20 bg-slate-200"
      >
        <h2 className="text-lg font-bold mb-4">Edit Land</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // console.log("Form data:", formData);
            updateLand(editingLand._id, formData);
          }}
          className="mb-4 bg-slate-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block font-medium mb-1 text-gray-700"
              >
                Title:
              </label>
              <input
                placeholder="Product Name"
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block font-medium mb-1 text-gray-700"
              >
                Description:
              </label>
              <textarea
                placeholder="Land Description"
                name="description"
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block font-medium mb-1 text-gray-700"
              >
                Price:
              </label>
              <input
                placeholder="Product Price"
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block font-medium mb-1 text-gray-700"
              >
                Location:
              </label>
              <input
                placeholder="Location"
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2 capitalize"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor=""
                className="block font-medium mb-1 text-gray-700"
              >
                Acreage
              </label>
              <input
                placeholder="Acreage"
                type="number"
                name="acreage"
                id="acreage"
                value={formData.acreage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acreage: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block font-medium mb-1 text-gray-700"
              >
                Images:
              </label>
              <input
                placeholder="Images"
                type="file"
                multiple
                name="images"
                onChange={handleFileChange}
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="color"
                className="block font-medium mb-1 text-gray-700"
              >
                Category ID:
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              >
                {categories.map((categoryId) => (
                  <option key={categoryId._id} value={categoryId._id}>
                    {categoryId.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 font-semibold rounded-md hover:bg-indigo-600"
            >
              Update Land
            </button>
          </div>
        </form>

        <button
          onClick={closeModal}
          className="w-full px-4 py-2 text-white bg-teal font-semibold rounded-md hover:bg-darkteal "
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default LandManagement;
