import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import api from "../services/api";

export default function LostAndFound() {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all, lost, found
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemType, setItemType] = useState("lost");
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "electronics",
    location: "",
    date: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get("/lost-found");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/lost-found", {
        ...newItem,
        type: itemType,
      });
      alert("Item posted successfully!");
      setShowAddModal(false);
      setNewItem({
        title: "",
        description: "",
        category: "electronics",
        location: "",
        date: "",
      });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to post item");
    }
  };

  const handleContact = async (itemId) => {
    try {
      const response = await api.get(`/lost-found/${itemId}/contact`);
      alert(`Contact: ${response.data.contact}`);
    } catch (error) {
      console.error("Error getting contact:", error);
      alert("Failed to get contact information");
    }
  };

  const handleMarkResolved = async (itemId) => {
    try {
      await api.patch(`/lost-found/${itemId}/resolve`);
      alert("Item marked as resolved!");
      fetchItems();
    } catch (error) {
      console.error("Error marking resolved:", error);
      alert("Failed to update item");
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: "bi-phone",
      documents: "bi-file-text",
      accessories: "bi-bag",
      books: "bi-book",
      other: "bi-question-circle",
    };
    return icons[category] || "bi-question-circle";
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Lost & Found</h2>
          <p className="text-muted mb-0">Help the community find lost items</p>
        </div>
        <img
          src={theme === "light" ? "/light.png" : "/dark.png"}
          alt="CampusHive Logo"
          style={{ height: 50 }}
        />
      </div>

      {/* Action Buttons */}
      <div className="mb-4 d-flex gap-2">
        <button
          className="btn btn-danger shadow-sm"
          onClick={() => {
            setItemType("lost");
            setShowAddModal(true);
          }}
          style={{ borderRadius: 12 }}
        >
          Report Lost Item
        </button>
        <button
          className="btn btn-success shadow-sm"
          onClick={() => {
            setItemType("found");
            setShowAddModal(true);
          }}
          style={{ borderRadius: 12 }}
        >
          Report Found Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="card shadow-sm border-0 mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body">
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className={`btn ${
                filter === "all" ? "btn-warning" : "btn-outline-warning"
              }`}
              onClick={() => setFilter("all")}
            >
              All Items
            </button>
            <button
              type="button"
              className={`btn ${
                filter === "lost" ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setFilter("lost")}
            >
              Lost Items
            </button>
            <button
              type="button"
              className={`btn ${
                filter === "found" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setFilter("found")}
            >
              Found Items
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="row">
        {filteredItems.length === 0 ? (
          <div className="col-12">
            <div className="card shadow border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No items found</h4>
                <p className="text-muted">
                  Be the first to report a lost or found item!
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div
                className={`card shadow-sm border-0 h-100 ${
                  item.resolved ? "opacity-50" : ""
                }`}
                style={{ borderRadius: 16 }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{item.title}</h5>
                    <span
                      className={`badge ${
                        item.type === "lost" ? "bg-danger" : "bg-success"
                      }`}
                    >
                      {item.type === "lost" ? "LOST" : "FOUND"}
                    </span>
                  </div>
                  <p className="card-text mb-2">{item.description}</p>
                  <div className="mb-2">
                    <span className="badge bg-secondary">{item.category}</span>
                  </div>
                  <p className="card-text mb-2">
                    <small className="text-muted">{item.location}</small>
                  </p>
                  <p className="card-text mb-3">
                    <small className="text-muted">
                      {new Date(item.date).toLocaleDateString()}
                    </small>
                  </p>
                  {item.resolved ? (
                    <div className="alert alert-success mb-0">Resolved</div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary flex-grow-1"
                        onClick={() => handleContact(item._id)}
                        style={{ borderRadius: 8 }}
                      >
                        Contact
                      </button>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleMarkResolved(item._id)}
                        style={{ borderRadius: 8 }}
                      ></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  Report {itemType === "lost" ? "Lost" : "Found"} Item
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddItem}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newItem.title}
                      onChange={(e) =>
                        setNewItem({ ...newItem, title: e.target.value })
                      }
                      required
                      placeholder="e.g., Blue Water Bottle"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      required
                      placeholder="Provide details to help identify the item..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                    >
                      <option value="electronics">Electronics</option>
                      <option value="documents">Documents</option>
                      <option value="accessories">Accessories</option>
                      <option value="books">Books</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newItem.location}
                      onChange={(e) =>
                        setNewItem({ ...newItem, location: e.target.value })
                      }
                      required
                      placeholder="e.g., Library, Cafeteria"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newItem.date}
                      onChange={(e) =>
                        setNewItem({ ...newItem, date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-${
                      itemType === "lost" ? "danger" : "success"
                    }`}
                  >
                    Report Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
