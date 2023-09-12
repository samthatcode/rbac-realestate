import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


Modal.setAppElement("#root");
const modalStyles = {
  content: {
    height: "500px", // Adjust the height as per your requirement
    overflowY: "auto",
  },
};

const ITEMS_PER_PAGE = 5; // Number of items per page

const ProductManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    numberOfRooms: "",
    squareFootage: "",
    numberOfBeds: "",
    numberOfBaths: "",
    images: [],
    categoryId: "",
  });
  const [editingProduct, setEditingProduct] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        numberOfRooms: "",
        squareFootage: "",
        numberOfBeds: "",
        numberOfBaths: "",
        images: [],
        categoryId: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  // fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        // "/api/products",
        "https://surefinders-backend.onrender.com/api/products",
        { withCredentials: true }
      );
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // fetching categories
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

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const getPageData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    // Inside handleInputChange function
    if (e.target.name === "image" || e.target.name === "images") {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles); // Update selected files in the state
      setFormData({
        ...formData,
        [e.target.name]: selectedFiles,
        [`${e.target.name}Name`]: selectedFiles.map((file) => file.name), // Store file names
      });
    } else if (e.target.name === "imageUrl") {
      setFormData({
        ...formData,
        image: e.target.value,
        imageName: "imageUrl", // store the file name
      });
    } else if (e.target.name === "categoryId") {
      const selectedCategoryId = e.target.value;
      // console.log("Selected Category ID:", selectedCategoryId);
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

  // Create Product
  const createProduct = async () => {
    setIsCreatingProduct(true);
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();
      // console.log("formData images:", formData["images"]); 
      // Inside createProduct function
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

      // console.log("image after loop:", formDataToSend.getAll("images")); 
      // Make the API request to send the form data to the server
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await axios.post(
        // "/api/products",
        "https://surefinders-backend.onrender.com/api/products",
        formDataToSend,
        { withCredentials: true }
      );
      const createdProduct = response.data.data;
      toast.success("Product created successfully");
      setProducts([...products, createdProduct]);
      setFiles([]);
      // Reset the form
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        numberOfRooms: "",
        squareFootage: "",
        numberOfBeds: "",
        numberOfBaths: "",
        images: [],
        categoryId: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setIsCreatingProduct(false);
    }
    closeModal();
  };

  const updateProduct = async (id, updatedProduct) => {
    const productToUpdate = products.find((product) => product._id === id);
    if (!productToUpdate) {
      console.error("Product not found:", id);
      toast.error("Product not found");
      return;
    }
    try {
      // Create a new FormData instance
      let formData = new FormData();
      // Append the fields in the updatedProduct object to the formData
      for (let key in updatedProduct) {
        if (key === "images") {
          if (Array.isArray(files) && files.length > 0) {
            files.forEach((fileObj, index) => {
              formData.append("images", fileObj.file, fileObj.name);
            });
          }
        } else {
          formData.append(key, updatedProduct[key]);
        }
      }
      // Send the formData with the PUT request
      await axios.put(
        // `/api/products/${id}`,
        `https://surefinders-backend.onrender.com/api/products/${id}`,
        formData,
        { withCredentials: true }
      );

      fetchProducts();
      toast.success("Product updated successfully");
      setIsFormSubmitted(true);
      // Reset the form
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        numberOfRooms: "",
        squareFootage: "",
        numberOfBeds: "",
        numberOfBaths: "",
        images: [],
        categoryId: "",
      });
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(`Failed to update product: ${error.message}`);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          // `/api/products/${id}`,
          `https://surefinders-backend.onrender.com/api/products/${id}`,
          { withCredentials: true }
        );
        fetchProducts();
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const openModal = (product) => {
    // Extract the properties needed for the form data
    const {
      title,
      description,
      price,
      location,
      numberOfRooms,
      squareFootage,
      numberOfBeds,
      numberOfBaths,
      categoryId,
    } = product;
    // Create a new object with the extracted properties and set it as the form data
    setFormData({
      title,
      description,
      price,
      location,
      numberOfRooms,
      squareFootage,
      numberOfBeds,
      numberOfBaths,
      categoryId,
      images: [], 
    });
    setEditingProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      numberOfRooms: "",
      squareFootage: "",
      numberOfBeds: "",
      numberOfBaths: "",
      images: [],
      categoryId: "",
    });
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
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createProduct();
        }}
        className="mb-4 mx-auto bg-slate-200 p-6 rounded-lg shadow-md"
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
              placeholder="Product Title"
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
              htmlFor="numberOfRooms"
              className="block font-medium mb-1 text-gray-700"
            >
              Rooms
            </label>
            <input
              placeholder="Number of Rooms"
              type="number"
              name="numberOfRooms"
              id="numberOfRooms"
              value={formData.numberOfRooms}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="squareFootage"
              className="block font-medium mb-1 text-gray-700"
            >
              Square Footage / Area
            </label>
            <input
              placeholder="Square Footage / Area"
              type="number"
              name="squareFootage"
              id="squareFootage"
              value={formData.squareFootage}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numberOfBaths"
              className="block font-medium mb-1 text-gray-700"
            >
              Baths
            </label>
            <input
              placeholder="Number of Baths"
              type="number"
              name="numberOfBaths"
              id="numberOfBaths"
              value={formData.numberOfBaths}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numberOfBeds"
              className="block font-medium mb-1 text-gray-700"
            >
              Beds
            </label>
            <input
              placeholder="Number of Beds"
              type="number"
              name="numberOfBeds"
              id="numberOfBeds"
              value={formData.numberOfBeds}
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
              disabled={isCreatingProduct}
            >
              {isCreatingProduct ? "Creating Product..." : "Create Product"}
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
            {getPageData().map((product, index) => (
              <tr key={product._id}>
                <td className="border px-4 py-2">
                  {currentPage * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="border px-4 py-2 capitalize">{product.title}</td>
                <td className="border px-4 py-2 text-green font-semibold ">
                  &#x20A6;{product.price?.toLocaleString()}
                </td>
                <td className="border px-4 py-2 capitalize">
                  {product.description}
                </td>
                <td className="border px-4 py-2">{product.categoryId}</td>
                <td className="border px-4 py-2 flex justify-between gap-4">
                  <button
                    onClick={() => openModal(product)}
                    className="text-primary hover:text-blue font-bold bg-slate-100 px-2 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
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
        <h2 className="text-lg font-bold mb-4">Edit Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form data:", formData);
            updateProduct(editingProduct._id, formData);
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
                placeholder="Product Description"
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
                htmlFor="numberOfRooms"
                className="block font-medium mb-1 text-gray-700"
              >
                Rooms:
              </label>
              <input
                placeholder="Number of Rooms"
                type="number"
                name="numberOfRooms"
                id="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfRooms: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="squareFootage"
                className="block font-medium mb-1 text-gray-700"
              >
                Square Footage / Area
              </label>
              <input
                placeholder="Square Footage / Area"
                type="number"
                name="squareFootage"
                id="squareFootage"
                value={formData.squareFootage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    squareFootage: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="numberOfBaths"
                className="block font-medium mb-1 text-gray-700"
              >
                Baths
              </label>
              <input
                placeholder="Number of Baths"
                type="number"
                name="numberOfBaths"
                id="numberOfBaths"
                value={formData.numberOfBaths}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfBaths: e.target.value,
                  })
                }
                className="w-full border-gray-300 rounded-md sm:text-sm px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="numberOfBeds"
                className="block font-medium mb-1 text-gray-700"
              >
                Beds
              </label>
              <input
                placeholder="Number of Beds"
                type="number"
                name="numberOfBeds"
                id="numberOfBeds"
                value={formData.numberOfBeds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfBeds: e.target.value,
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
              Update Product
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

export default ProductManagement;
