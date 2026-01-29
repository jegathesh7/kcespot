import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import AchieversTable from "./AchieversTable";
import AchieversForm from "./AchieversForm";
import "./achievers.css";

export default function AchieversPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/achievers");
      setData(res.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Protect against browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/achievers/${editingItem._id}`, formData);
        setSuccessMessage("Achievement updated successfully!");
      } else {
        await api.post("/achievers", formData);
        setSuccessMessage("New achievement added successfully!");
      }
      setIsDirty(false); // Reset dirty state on save
      setActiveTab("list");
      setEditingItem(null);
      loadData();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save achievement", error);
      alert("Failed to save achievement");
    }
  };

  const handleEdit = (row) => {
    // If dirty, we technically should block this too, but usually Edit button is on List view,
    // so we assume list view means no dirty form open.
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    await api.delete(`/achievers/${id}`);
    loadData();
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put(`/achievers/${id}`, { status: !currentStatus });
      loadData();
      setSuccessMessage("Status updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const handleCancel = () => {
    setIsDirty(false);
    setActiveTab("list");
    setEditingItem(null);
  };

  // Tab Selection Handler
  const handleTabSelect = (k) => {
    if (activeTab === "form" && isDirty && k !== "form") {
      // Attempting to leave dirty form
      setNextTab(k);
      setShowConfirmModal(true);
    } else {
      // Normal switch
      proceedToTab(k);
    }
  };

  const proceedToTab = (k) => {
    setActiveTab(k);
    if (k === "list") setEditingItem(null);
    else if (k === "form" && !editingItem) setEditingItem(null);
  };

  const handleConfirmDiscard = () => {
    setIsDirty(false);
    setShowConfirmModal(false);
    if (nextTab) {
      proceedToTab(nextTab);
      setNextTab(null);
    }
  };

  const handleConfirmSave = () => {
    if (formRef.current) {
      // Trigger validation and save from the form
      const submitted = formRef.current.submitForm();
      if (submitted) {
        setShowConfirmModal(false);
        setNextTab(null);
      }
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-primary mb-0">Achievers Management</h2>
          <p className="text-muted small mb-0">
            Record and manage student achievements
          </p>
        </div>
      </div>

      <Nav
        variant="tabs"
        className="mb-4"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="fw-bold px-4">
            View List
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="fw-bold px-4">
            {editingItem ? "Edit Entry" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <AchieversTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {activeTab === "form" && (
        <AchieversForm
          ref={formRef}
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
          setIsDirty={setIsDirty}
        />
      )}

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <div className="mb-4 text-success">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h4 className="fw-bold mb-3 success-modal-title">Success!</h4>
          <p className="text-muted mb-4">{successMessage}</p>
          <Button
            variant="success"
            className="px-5 py-2 fw-bold"
            onClick={() => setShowSuccessModal(false)}
            style={{ borderRadius: "50px" }}
          >
            Awesome!
          </Button>
        </Modal.Body>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes in the form. Do you want to save them before
          leaving?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDiscard}>
            Discard Changes
          </Button>
          <Button variant="primary" onClick={handleConfirmSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
