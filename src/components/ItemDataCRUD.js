import React, { Fragment, useState, useEffect } from "react";
import { ref, off, query, limitToLast, get } from "firebase/database";
import moment from "moment";
import BlockUi from "react-block-ui";
import { collections } from "../utils/constants";
import { db } from "../firebase";
import {
  updateItem,
  removeItem,
  createItem,
} from "../services/firebase.service";
import Pagination from "./Pagination";
import { itemModel } from "../utils/models";

function ItemDataCRUD() {
  const itemsRef = ref(db, collections.items);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData();
    return () => {
      off(itemsRef);
    };
  }, [itemsPerPage, currentPage]);

  async function fetchData() {
    try {
      setLoading(true);
      await fetchTotalItems();
      const items = [];
      const startIndex = (currentPage - 1) * itemsPerPage;
      const snapshot = await get(
        query(itemsRef, limitToLast(startIndex + itemsPerPage))
      );
      snapshot.forEach((childSnapshot) => {
        items.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      const serializedData = items
        .slice(0, itemsPerPage)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => ({
          ...item,
          createdAt: item?.createdAt
            ? moment(item.createdAt).format("DD.MM.YYYY HH:mm:ss")
            : "",
          updatedAt: item?.updatedAt
            ? moment(item.updatedAt).format("DD.MM.YYYY HH:mm:ss")
            : "",
        }));

      setItems(serializedData);
    } catch (error) {
      console.log("fetchData error: ", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchTotalItems = async () => {
    try {
      const snapshot = await get(itemsRef);
      const totalCount = snapshot?.size || 0;
      setTotalItems(totalCount);
    } catch (error) {
      console.log("fetchTotalItems error: ", error);
    }
  };

  async function handleDelete(v) {
    try {
      const result = window.confirm("Are you sure want delete item?");
      if (result) {
        await removeItem(collections.items, v.id);
        fetchData();
      }
    } catch (error) {
      console.log("handleDelete error: ", error);
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber + 1);
  };

  const handlePerPageChange = (perPage) => {
    setItemsPerPage(perPage);
  };

  function CreateItemForm() {
    const [itemForm, setItemForm] = useState(itemModel());

    const handleCreateItem = () => {
      createItem(collections.items, itemForm);
      setItemForm(itemModel());
      fetchData();
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setItemForm({ ...itemForm, [name]: value });
    };

    return (
      <Fragment>
        <input
          type="text"
          className="form-control"
          placeholder="Item Name"
          value={itemForm.name}
          name="name"
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Item Description"
          value={itemForm.description}
          name="description"
          onChange={handleChange}
        />
        <button
          className="btn btn-success mt-2"
          onClick={handleCreateItem}
          data-bs-dismiss="modal"
        >
          Create
        </button>
      </Fragment>
    );
  }

  function CreateItemModal() {
    return (
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create item
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CreateItemForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function EditItemForm({ selectedItem }) {
    const [itemForm, setItemForm] = useState(selectedItem);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setItemForm({ ...itemForm, [name]: value });
    };

    const handleEditItem = async () => {
      try {
        const { id, createdAt, ...rest } = itemForm;
        await updateItem(collections.items, id, {
          ...rest,
          updatedAt: Date.now(),
        });
        setItemForm(itemModel());
        fetchData();
      } catch (error) {
        console.log("handleEditItem error: ", error);
      }
    };

    return (
      <div>
        <input
          type="text"
          className="form-control"
          placeholder="Item Name"
          name="name"
          value={itemForm?.name || ""}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Item Description"
          name="description"
          value={itemForm?.description || ""}
          onChange={handleChange}
        />
        <button
          data-bs-dismiss="modal"
          className="btn btn-primary mt-2"
          onClick={handleEditItem}
        >
          Save Changes
        </button>
      </div>
    );
  }

  function EditItemModal() {
    return (
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Update item
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <EditItemForm selectedItem={selectedItem} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DataTable() {
    return (
      <>
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((item) => (
                <th key={item}>{item}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v) => (
              <tr key={v.id}>
                {columns.map((k) => (
                  <td key={k} style={k === "id" ? { width: 230 } : {}}>
                    {v[k]}
                  </td>
                ))}
                <td style={{ width: 150 }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                    onClick={() => setSelectedItem(v)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(v)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </>
    );
  }

  const firstItem = items[0];
  const columns = firstItem ? Object.keys(firstItem) : [];

  return (
    <Fragment>
      <BlockUi blocking={loading} tag="div" message="Loading...">
        {items.length ? (
          DataTable()
        ) : (
          <div className="text-center">No data found</div>
        )}
      </BlockUi>

      {CreateItemModal()}
      {EditItemModal()}
    </Fragment>
  );
}

export default ItemDataCRUD;
