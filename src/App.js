import React, { Fragment } from "react";
import ItemDataCRUD from "./components/ItemDataCRUD";

function App() {
  return (
    <Fragment>
      <div className="container mt-4">
        <h3 className="text-center">
          Firebase V9 Realtime Database & ReactJS
        </h3>
        <h4 className="text-center text-muted mb-4">CRUD and Pagination</h4>
        <hr />
        <div className="row">
          <div className="col-6">
            <div className="mb-2">
              <h3>Items</h3>
            </div>
          </div>
          <div className="col-6">
            <div
              className="mb-2"
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Create
              </button>
            </div>
          </div>
          <div className="col-12">
            <ItemDataCRUD />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
