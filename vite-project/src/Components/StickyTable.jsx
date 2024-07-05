import { useState, useMemo } from "react";
import "../assets/styles/StickyTable.css";

const StickyTable = ({ data, selectedMonth }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Changed from 5 to 10

  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const saleDate = new Date(item.dateOfSale);
      return (
        saleDate.toLocaleString("default", { month: "long" }) === selectedMonth
      );
    });
  }, [data, selectedMonth]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  return (
    <section className="table-section">
      <div className="table-container">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Sold</th>
              <th>Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>
                  <img src={product.image} alt={product.title} width="100" />
                </td>
                <td>{product.sold ? "Yes" : "No"}</td>
                <td>{product.dateOfSale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <select
            className="form-select page-select"
            value={currentPage}
            onChange={handlePageChange}
          >
            {[...Array(totalPages).keys()].map((page) => (
              <option key={page + 1} value={page + 1}>
                {page + 1}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default StickyTable;
