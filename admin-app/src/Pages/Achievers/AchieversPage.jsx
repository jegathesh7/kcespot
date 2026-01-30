import { useEffect, useState, useRef } from "react";
import { Container, Nav, Modal, Button } from "react-bootstrap";
import api from "../../api/axios";
import AchieversTable from "./AchieversTable";
import AchieversForm from "./AchieversForm";

import "./achievers.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import FileDownloadIcon from "@mui/icons-material/FileDownload"; // Assuming you might want an icon, or just use text
import Swal from "sweetalert2";

export default function AchieversPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");

  // Dirty State Logic
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nextTab, setNextTab] = useState(null);
  const formRef = useRef();

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/achievers", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          college: filterCollege,
        },
      });
      // Handle response structure { data: [], totalPages: 5, ... }
      if (res.data && res.data.data) {
        setData(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        // Fallback if backend not updated or returns array
        setData(res.data);
      }
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly to avoid too many requests
    const timer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterCollege]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (college) => {
    setFilterCollege(college);
    setCurrentPage(1); // Reset to first page on filter
  };

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
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "success",
          title: "Achievement updated successfully!",
        });
      } else {
        await api.post("/achievers", formData);
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).fire({
          icon: "success",
          title: "New achievement added successfully!",
        });
      }
      setIsDirty(false); // Reset dirty state on save
      setActiveTab("list");
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error("Failed to save achievement", error);
      Swal.fire("Error", "Failed to save achievement", "error");
    }
  };

  const handleEdit = (row) => {
    // If dirty, we technically should block this too, but usually Edit button is on List view,
    // so we assume list view means no dirty form open.
    setEditingItem(row);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/achievers/${id}`);
      loadData();

      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: "success",
        title: "Record has been deleted.",
      });
    } catch (err) {
      Swal.fire("Error", "Failed to delete record", "error");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put(`/achievers/${id}`, { status: !currentStatus });
      loadData();
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      }).fire({
        icon: "success",
        title: "Status updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update status", error);
      Swal.fire("Error", "Failed to update status", "error");
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

  // Export Data Logic
  const handleExportPDF = async () => {
    try {
      const res = await api.get("/achievers", {
        params: { limit: 1000, search: searchTerm, college: filterCollege },
      });
      const exportData = res.data.data || res.data; // Handle pagination or list

      const doc = new jsPDF();
      doc.text("Achievers List", 14, 15);

      const tableColumn = ["Name", "College", "Batch", "Category", "Status"];
      const tableRows = [];

      exportData.forEach((item) => {
        const rowData = [
          item.name,
          item.college,
          item.batch,
          item.category,
          item.status ? "Active" : "Closed",
        ];
        tableRows.push(rowData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });

      doc.save("achievers_report.pdf");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await api.get("/achievers", {
        params: { limit: 1000, search: searchTerm, college: filterCollege },
      });
      const exportData = res.data.data || res.data;

      const worksheet = XLSX.utils.json_to_sheet(
        exportData.map((item) => ({
          Name: item.name,
          College: item.college,
          Batch: item.batch,
          Category: item.category,
          Description: item.description,
          EventDate: item.eventDate ? item.eventDate.split("T")[0] : "",
          Status: item.status ? "Active" : "Closed",
        })),
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Achievers");
      XLSX.writeFile(workbook, "achievers_report.xlsx");
    } catch (error) {
      console.error("Excel export failed", error);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Achievers Management</h2>
          <p className="text-muted small mb-0">
            Record and manage student achievements
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
          // Pagination & Filtering Props
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCollege={filterCollege}
          onFilterChange={handleFilterChange}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
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
