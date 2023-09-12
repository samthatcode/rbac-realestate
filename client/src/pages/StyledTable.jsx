import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 5; // Number of items per page

const StyledTable = ({ data, approveMarketer }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleApproveClick = (marketerId) => {
    approveMarketer(marketerId);
    toast.success("Marketer Approved!", {
      autoClose: 1000,
      position: "top-right",
    });
  };

  const getPageData = () => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  return (
    <div className="p-4 bg-white shadow rounded mt-5">
      <h2 className="font-bold text-lg mb-2 text-title">
        Inactive Marketers
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="py-1 px-2 border-b flex justify-between items-center">
              <th className="py-1 px-2">Lists</th>
              <th className="py-1 px-2">Email</th>
              <th className="py-1 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPageData().map((marketer, index) => (
              <tr
                key={marketer._id}
                className="py-1 px-2 border-b flex justify-between items-center"
              >
                <td className="py-1 px-2">
                  {currentPage * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="py-1 px-2 text-indigo-600 bg-indigo-100 rounded-lg p-1 text-xs font-semibold inline-block last:mr-0 mr-1 text-[14px]">
                  {marketer.email}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleApproveClick(marketer._id)}
                    className="text-purple-500 bg-purple-100 hover:bg-purple-200 rounded p-1 text-xs font-semibold inline-block py-1 px-2 last:mr-0 mr-1 text-[14px]"
                  >
                    Approve
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
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
        >
          {"<"}
        </button>
        <span className="text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
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
  );
};

export default StyledTable;
