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

const InvestmentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    investmentAmount: "",
    title: "",
    description: "",
    terms: "",
    images: [],
    location: "",
  });
  const [editingInvestment, setEditingInvestment] = useState("");
  const [isCreatingInvestment, setIsCreatingInvestment] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      setFormData({
        investmentAmount: "",
        title: "",
        description: "",
        terms: "",
        images: [],
        location: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(
        // "/api/investments",
        "https://surefinders-backend.onrender.com/api/investments",
        { withCredentials: true }
      );
      setInvestments(response.data.data);
    } catch (error) {
      console.error("Failed to fetch investments:", error);
    }
  };

  const totalPages = Math.ceil(investments.length / ITEMS_PER_PAGE);

  const getPageData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return investments.slice(startIndex, endIndex);
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
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const createInvestment = async () => {
    setEditingInvestment(true);
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
        // "/api/investments",
        "https://surefinders-backend.onrender.com/api/investments",
        formDataToSend,
        { withCredentials: true }
      );
      const createdInvestment = response.data.data;
      toast.success("Investment created successfully!", {
        autoClose: 1000,
        position: "top-right",
      });
      setInvestments([...investments, createdInvestment]);
      setFiles([]);
      setFormData({
        investmentAmount: "",
        title: "",
        description: "",
        terms: "",
        images: [],
        location: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create investments");
    } finally {
      setIsCreatingInvestment(false);
    }
    closeModal();
  };

  const updateInvestment = async (id, updatedInvestment) => {
    const investmentToUpdate = investments.find(
      (investment) => investment._id === id
    );
    if (!investmentToUpdate) {
      console.error("Investment not found:", id);
      toast.error("Investment not found");
      return;
    }
    try {
      let formData = new FormData();
      for (let key in updatedInvestment) {
        if (key === "images") {
          if (Array.isArray(files) && files.length > 0) {
            files.forEach((fileObj, index) => {
              formData.append("images", fileObj.file, fileObj.name);
            });
          }
        } else {
          formData.append(key, updatedInvestment[key]);
        }
      }

      await axios.put(
        // `/api/investments/${id}`,
        `https://surefinders-backend.onrender.com/api/investments/${id}`,
        formData,
        { withCredentials: true }
      );

      fetchInvestments();
      toast.success("Investment updated successfully!", {
        autoClose: 1000,
        position: "top-right",
      });
      setIsFormSubmitted(true);
      setFormData({
        investmentAmount: "",
        title: "",
        description: "",
        terms: "",
        images: [],
        location: "",
      });
    } catch (error) {
      console.error("Failed to update investment:", error);
      toast.error(`Failed to update investment: ${error.message}`);
    }
  };

  const deleteInvestment = async (id) => {
    if (window.confirm("Are you sure you want to delete this investment?")) {
      try {
        await axios.delete(
          // `/api/investments/${id}`,
          `https://surefinders-backend.onrender.com/api/investments/${id}`,
          { withCredentials: true }
        );
        fetchInvestments();
        toast.success("Investment deleted successfully!", {
          autoClose: 1000,
          position: "top-right",
        });
      } catch (error) {
        console.error("Failed to delete investment:", error);
        toast.error("Failed to delete investment");
      }
    }
  };

  const openModal = (investment) => {
    // Extract the properties needed for the form data
    const { investmentAmount, title, description, terms, location } =
      investment;

    // Create a new object with the extracted properties and set it as the form data
    setFormData({
      investmentAmount,
      title,
      description,
      terms,
      location,
      images: [], // Assuming you want to clear existing images when editing
    });

    setEditingInvestment(investment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setFormData({
      investmentAmount: "",
      title: "",
      description: "",
      terms: "",
      location: "",
      images: [],
    });
    setEditingInvestment("");
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
    <div className="p-8 bg-white">
      <div className="rounded-lg p-10 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Manage Investments</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createInvestment();
          }}
          className="mb-4 mx-auto bg-slate-50 p-6 rounded-lg shadow-md"
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
                placeholder="Investment Title"
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
                htmlFor="investmentAmount"
                className="block font-medium mb-1 text-gray-700"
              >
                Amount
              </label>
              <input
                placeholder="Investment Amount"
                type="number"
                name="investmentAmount"
                id="investmentAmount"
                value={formData.investmentAmount}
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
                htmlFor="terms"
                className="block font-medium mb-1 text-gray-700"
              >
                Terms
              </label>
              <textarea
                placeholder="Investment Terms"
                type="text"
                name="terms"
                id="terms"
                value={formData.terms}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md sm:text-sm px-3
              py-2"
              ></textarea>
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

            <div className="col-span-2 flex justify-center">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                disabled={isCreatingInvestment}
              >
                {isCreatingInvestment
                  ? "Creating Investment..."
                  : "Create Investment"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="rounded-lg my-10 p-10 shadow-xl">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-teal text-white">
                <th className="px-4 py-2">S/N</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Investment Amount</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getPageData().map((investment, index) => (
                <tr key={investment._id}>
                  <td className="border px-4 py-2">
                    {currentPage * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {investment.title}
                  </td>
                  <td className="border px-4 py-2 text-green font-semibold">
                    &#x20A6;{investment.investmentAmount?.toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {investment.description}
                  </td>
                  <td className="border px-4 py-2 flex items-center justify-between gap-4">
                    <button
                      onClick={() => openModal(investment)}
                      className="text-primary hover:text-blue font-bold bg-slate-100 px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteInvestment(investment._id)}
                      className="text-red font-bold bg-slate-100 px-4 py-2 rounded-md"
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
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles} // Apply the modal styles
        className="p-4 mt-20 bg-slate-200"
      >
        <h2 className="text-lg font-bold mb-4">Edit Investment</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateInvestment(editingInvestment._id, formData);
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
                placeholder="Investment Title"
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
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
                placeholder="Investment Description"
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
                htmlFor="amount"
                className="block font-medium mb-1 text-gray-700"
              >
                Amount:
              </label>
              <input
                placeholder="Investment Amount"
                type="number"
                name="investmentAmount"
                id="investmentAmount"
                value={formData.investmentAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    investmentAmount: e.target.value,
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
                htmlFor="terms"
                className="block font-medium mb-1 text-gray-700"
              >
                Terms:
              </label>
              <textarea
                placeholder="Investment Terms"
                type="text"
                name="terms"
                id="terms"
                value={formData.terms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    terms: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3
               py-2"
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="images"
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

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 font-semibold rounded-md hover:bg-indigo-600"
            >
              Update Investment
            </button>
          </div>
        </form>

        <button
          onClick={closeModal}
          className="w-full px-4 py-2 text-white bg-teal font-semibold rounded-md hover:bg-darkteal"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default InvestmentManagement;
