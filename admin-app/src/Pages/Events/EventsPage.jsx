import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import EventsTable from "./EventsTable";
import EventsForm from "./EventsForm";
import "./events.css";
// Reusing Achievers CSS for shared styles if compatible, or ensuring events.css has them.
import "../Achievers/achievers.css";
// Imports for Export
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [events, setEvents] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState("");

  // States for features
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const formRef = useRef();

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          campus: filterCampus,
        },
      });
      if (res.data && res.data.data) {
        setEvents(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setEvents(res.data);
      }
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterCampus]);

  // Handlers
  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const handleFilterChange = (val) => {
    setFilterCampus(val);
    setCurrentPage(1);
  };

  const handleExportPDF = async () => {
    try {
      const res = await api.get("/events", {
        params: { limit: 1000, search: searchTerm, campus: filterCampus },
      });
      const data = res.data.data || res.data;

      // Use landscape for better column fit
      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(16);
      doc.text("Events List", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

      const tableColumn = [
        "Title",
        "Event Date",
        "Reg Start",
        "Reg End",
        "Campus",
        "Type",
        "Org", // Shortened
        "Status",
        // "Description", // Exclude description to save space, or truncate heavily
        "Target",
        "Mode",
        "Visibility",
        "Venue",
      ];

      const tableRows = data.map((item) => [
        item.title,
        item.eventDate ? item.eventDate.split("T")[0] : "-",
        item.startDate ? item.startDate.split("T")[0] : "-",
        item.endDate ? item.endDate.split("T")[0] : "-",
        item.campus,
        item.type,
        item.organizer,
        item.status ? "Active" : "Inactive",
        // item.description, // Skipping nice-to-have but bulky fields
        item.targetAudience,
        item.mode,
        item.visibility,
        item.venue,
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [22, 163, 74] }, // Greenish user theme or standard blue
        columnStyles: {
          0: { cellWidth: 30 }, // Title
          // Adjust others if needed
        },
      });

      doc.save("events_report.pdf");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await api.get("/events", {
        params: { limit: 1000, search: searchTerm, campus: filterCampus },
      });
      const data = res.data.data || res.data;
      const worksheet = XLSX.utils.json_to_sheet(
        data.map((item) => ({
          Title: item.title,
          Event_Date: item.eventDate ? item.eventDate.split("T")[0] : "",
          Registration_End_Date: item.endDate ? item.endDate.split("T")[0] : "",
          Registration_Start_Date: item.startDate
            ? item.startDate.split("T")[0]
            : "",
          Campus: item.campus,
          Venue: item.venue,
          Type: item.type,
          Mode: item.mode,
          Visibility: item.visibility,
          Organizer: item.organizer,
          Status: item.status ? "Active" : "Inactive",
          Description: item.description,
          Target_Audience: item.targetAudience,
        })),
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
      XLSX.writeFile(workbook, "events_report.xlsx");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  // Protect against browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleEdit = (event) => {
    setEditingItem(event);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put(`/events/${id}`, { status: !currentStatus });
      loadEvents();
      setSuccessMessage("Status updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/events/${editingItem._id}`, formData);
        setSuccessMessage("Event updated successfully!");
      } else {
        await api.post("/events", formData);
        setSuccessMessage("New event created successfully!");
      }
      setIsDirty(false); // Reset dirty state on save
      setActiveTab("list");
      setEditingItem(null);
      loadEvents();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save event", error);
      alert("Failed to save event");
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
      setNextTab(k);
      setShowConfirmModal(true);
    } else {
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
          <h2 className="fw-bold color2 mb-0">Events Management</h2>
          <p className="text-muted small mb-0">
            Create and manage upcoming college events
          </p>
        </div>
      </div>

      <Nav
        variant="pills"
        className="modern-tabs mb-4"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="px-4">
            View List
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="form" className="px-4">
            {editingItem ? "Edit Event" : "Add New"}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <EventsTable
          data={events}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
          // Pagination & Filtering
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCampus={filterCampus}
          onFilterChange={handleFilterChange}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />
      )}

      {activeTab === "form" && (
        <EventsForm
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
