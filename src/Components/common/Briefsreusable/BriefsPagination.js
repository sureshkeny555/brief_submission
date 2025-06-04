// components/Pagination.js
import React from "react";
import { getPageNumbers } from "../../../utils/paginationUtils";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="pagination-today">
      <button
        className="pagination-button-today"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;Previous
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          className={`pagination-numbers-today ${
            page === currentPage ? "active" : ""
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}>
          {page}
        </button>
      ))}

      <button
        className="pagination-button-today"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next&raquo;
      </button>
    </div>
  );
};

export default Pagination;
