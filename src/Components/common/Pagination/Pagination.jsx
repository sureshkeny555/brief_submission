import React from 'react';
import PropTypes from 'prop-types';
import s from './Pagination.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    if (totalPages <= 10) {
      return pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? s.active : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ));
    } else {
      let renderedPages = [];
      if (currentPage <= 5) {
        renderedPages = [...pages.slice(0, 5), '...', totalPages];
      } else if (currentPage >= totalPages - 4) {
        renderedPages = [1, '...', ...pages.slice(totalPages - 5)];
      } else {
        renderedPages = [1, '...', ...pages.slice(currentPage - 3, currentPage + 2), '...', totalPages];
      }

      return renderedPages.map((page, index) => (
        <button
          key={index}
          className={page === currentPage ? s.active : ''}
          onClick={() => onPageChange(typeof page === 'number' ? page : currentPage)}
        >
          {page}
        </button>
      ));
    }
  };

  return (
    <div className={s.pagination}>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        <FiChevronLeft />
      </button>

      {renderPageNumbers()}

      <button onClick={handleNext} disabled={currentPage === totalPages}>
        <FiChevronRight />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
