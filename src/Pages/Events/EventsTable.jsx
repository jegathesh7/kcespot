import { useState } from "react";
import { Table, Form, Button, Pagination, Modal } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
// Reaction Icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Swal from "sweetalert2";

import TablePlaceholder from "../../component/TablePlaceholder";

export default function EventsTable({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  filterCampus,
  onFilterChange,
  onExportExcel,
  onExportPDF,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleViewImage = (title, imageUrl) => {
    setSelectedTitle(title);
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage("");
    setSelectedTitle("");
  };

  const handleStatusClick = (eventItem) => {
    const newStatus = !eventItem.status;
    Swal.fire({
      title: "Update Status",
      text: `Do you want to change the status to ${newStatus ? "Active" : "Closed"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Mark as ${newStatus ? "Active" : "Closed"}`,
      confirmButtonColor: newStatus ? "#28a745" : "#6c757d",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await onStatusToggle(eventItem._id, eventItem.status);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const handleDeleteClick = (id, title) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the event "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await onDelete(id);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <>
      {/* Professional Toolbar */}
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
        {/* Search Bar */}
        <div className="position-relative w-50" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search events by title, organizer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2"
          />
        </div>

        {/* Actions Group */}
        <div className="d-flex align-items-center gap-3 w-100 w-lg-auto justify-content-end flex-wrap">
          {/* Filter */}
          <div className="d-flex align-items-center gap-2">
            <span
              className="text-muted small fw-bold d-none d-md-block"
              style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
              CAMPUS:
            </span>
            <Form.Select
              value={filterCampus}
              onChange={(e) => onFilterChange(e.target.value)}
              className="filter-select py-2 ps-3 pe-5"
              style={{ width: "auto", minWidth: "140px" }}
            >
              <option value="">All Campuses</option>
              <option value="KCE">KCE</option>
              <option value="KIT">KIT</option>
              <option value="KAHE">KAHE</option>
            </Form.Select>
          </div>

          <div
            className="vr h-100 mx-1 border-secondary opacity-25 d-none d-md-block"
            style={{ minHeight: "24px" }}
          ></div>

          {/* Exports */}
          <div className="d-flex gap-2">
            <button
              onClick={onExportExcel}
              className="export-btn export-btn-excel border-0"
            >
              <FileDownloadIcon fontSize="small" /> <span>Excel</span>
            </button>
            {/* <button
              onClick={onExportPDF}
              className="export-btn export-btn-pdf border-0"
            >
              <FileDownloadIcon fontSize="small" /> <span>PDF</span>
            </button> */}
          </div>
        </div>
      </div>
      {loading ? (
        <TablePlaceholder />
      ) : (
        <div className="modern-card">
          <div className="table-responsive">
            <Table className="custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "20%" }}>
                    Event Details
                  </th>
                  <th style={{ width: "5%" }}>College</th>
                  <th style={{ width: "10%" }}>Organizer</th>
                  <th style={{ width: "5%" }}>Mode</th>
                  <th style={{ width: "8%" }}>Venue</th>
                  <th style={{ width: "8%" }}>Category</th>
                  {/* <th style={{ width: "6%" }}>Visibility</th> */}
                  <th className="text-center" style={{ width: "6%" }}>
                    Images
                  </th>
                  <th className="text-center" style={{ width: "8%" }}>
                    Status
                  </th>
                  <th
                    className="text-end pe-4"
                    style={{ minWidth: "100px", width: "auto" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((e) => (
                    <tr key={e._id}>
                      {/* 1. Event Details */}
                      <td className="ps-4">
                        <div className="profile-cell-container">
                          <div className="profile-info">
                            <span
                              className="profile-name text-truncate"
                              style={{ maxWidth: "200px" }}
                              title={e.title}
                            >
                              {e.title}
                            </span>
                            <span className="profile-subtitle">
                              {e.eventDate
                                ? new Date(e.eventDate).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "No Date"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. College */}
                      <td>
                        {e.campus ? (
                          <span
                            className={`modern-badge ${getBadgeClassOfCollege(e.campus)}`}
                          >
                            {e.campus}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>

                      {/* 3. Organizer */}
                      <td>
                        <span
                          className="fw-medium text-dark small text-truncate d-block"
                          style={{ maxWidth: "100px" }}
                          title={e.organizer}
                        >
                          {e.organizer || "-"}
                        </span>
                      </td>

                      {/* 4. Mode */}
                      <td>
                        <span className="fw-medium text-dark small">
                          {e.mode || "N/A"}
                        </span>
                      </td>

                      {/* 5. Venue */}
                      <td>
                        <span
                          className="small text-muted text-truncate d-block"
                          style={{ maxWidth: "100px" }}
                          title={e.venue}
                        >
                          {e.venue || "-"}
                        </span>
                      </td>

                      {/* 6. Category */}
                      <td>
                        <span className="modern-badge badge-category">
                          {e.type}
                        </span>
                      </td>

                      {/* 7. Visibility */}
                      {/* <td>
                      <span className="small text-dark fw-medium">
                        {e.visibility}
                      </span>
                    </td> */}

                      {/* 8. Images */}
                      <td className="text-center">
                        {e.eventImage ? (
                          <Tooltip title="View Poster">
                            <Button
                              variant="light"
                              className="action-btn mx-auto"
                              onClick={() =>
                                handleViewImage(e.title, e.eventImage)
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>

                      {/* 9. Status */}
                      <td className="text-center">
                        <div className="status-wrapper">
                          <Form.Check
                            type="switch"
                            id={`status-${e._id}`}
                            checked={e.status}
                            onChange={() => handleStatusClick(e)}
                            style={{
                              cursor: "pointer",
                              margin: 0,
                              minHeight: "auto",
                            }}
                          />
                          <span
                            className={`status-label ${e.status ? "text-success" : "text-secondary"}`}
                          >
                            {e.status ? "Active" : "Closed"}
                          </span>
                        </div>
                      </td>

                      {/* 10. Actions */}
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Tooltip title="Edit" className="text-primary">
                            <button
                              className="action-btn edit"
                              onClick={() => onEdit(e)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" className="text-danger">
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteClick(e._id, e.title)}
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <div className="bg-light rounded-circle p-3 mb-3">
                          <SearchIcon
                            className="text-secondary opacity-50"
                            style={{ fontSize: "32px" }}
                          />
                        </div>
                        <h6 className="text-secondary fw-bold mb-1">
                          No events found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className="shadow-sm">
            <Pagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Image Preview Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: "16px" }}
            >
              <div className="modal-body p-0 position-relative">
                <button
                  className="btn btn-close position-absolute top-0 end-0 m-3 bg-white shadow-sm"
                  onClick={handleCloseModal}
                  style={{ opacity: 1, zIndex: 10 }}
                ></button>
                <img
                  src={formatImageUrl(selectedImage)}
                  alt={selectedTitle}
                  className="w-100 d-block"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
                <div className="p-3 bg-white text-center">
                  <h6 className="fw-bold mb-0">{selectedTitle}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reuse helper
function getBadgeClassOfCollege(college) {
  if (!college) return "badge-category";
  switch (college.toUpperCase()) {
    case "KCE":
      return "badge-college-kce";
    case "KIT":
      return "badge-college-kit";
    case "KAHE":
      return "badge-college-kahe";
    default:
      return "badge-category";
  }
}

function formatImageUrl(url) {
  if (!url) return "";

  if (!url.startsWith("http") && !url.startsWith("https")) {
    const cleanPath = url.replace(/\\/g, "/");
    // console.log(`${import.meta.env.VITE_IMAGE_BASE_URL}/${cleanPath}`);
    return `${import.meta.env.VITE_IMAGE_BASE_URL}/${cleanPath}`;
  }

  return url;
}
