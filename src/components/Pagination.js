import ReactPaginate from "react-paginate";

const Pagination = ({
  itemsPerPage,
  totalItems,
  onPageChange,
  onPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (pageObj) => {
    onPageChange(Number(pageObj.selected));
  };

  const handlePerPageClick = (event) => {
    const { value } = event.target;
    onPerPageChange(Number(value));
  };

  return (
    <div className="row">
      <div className="col-md-2">
        <select
          className="form-select"
          aria-label="Default select"
          value={itemsPerPage}
          onChange={handlePerPageClick}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
        </select>
      </div>
      <div
        className="col-md-10"
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <span
          className="text-muted"
          style={{
            marginRight: 30,
            display: "flex",
            alignItems: "center",
          }}
        >
          Total: {totalItems}
        </span>
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={totalPages}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default Pagination;
