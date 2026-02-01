import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Image,
  Modal,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import GroupsIcon from "@mui/icons-material/Groups";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Tooltip } from "@mui/material";
// Reaction Icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Swal from "sweetalert2";
import Logo from "../../assets/logo.png";
import KCELogo from "../../assets/KCE_LOGO.webp";
import KITLogo from "../../assets/KIT-LOGO.png";
import TablePlaceholder from "../../component/TablePlaceholder";
export default function AchieversTable({
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
  filterCollege,
  onFilterChange,
  onExportExcel,
  onExportPDF,
}) {
  // Image Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  // Logic moved to parent component (Server-side pagination)

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

  // Student Modal State
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  const handleViewStudents = (title, students, college) => {
    setSelectedTitle(title);
    setStudentData(students || []);
    setSelectedCollege(college);
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setStudentData([]);
    // Do not clear selectedTitle immediately if you want it to persist during fade out,
    // but here we can clear it or leave it.
  };

  const handleDeleteClick = (id, name) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the achievement record for ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Item",
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

  const handleStatusClick = (item) => {
    const newStatus = !item.status;
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
          await onStatusToggle(item._id, item.status);
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
        <div className="position-relative w-100" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2" // using new CSS class
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
              COLLEGE:
            </span>
            <Form.Select
              value={filterCollege}
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
        <>
          <div className="modern-card table-responsive">
            <Table className="custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "30%" }}>
                    Achievement Details
                  </th>
                  <th style={{ width: "10%" }}>College</th>
                  <th style={{ width: "10%" }}>Year</th>
                  <th style={{ width: "10%" }}>Category</th>
                  <th style={{ width: "20%" }}>Reactions</th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Images
                  </th>
                  <th className="text-center" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th className="text-end pe-4" style={{ width: "5%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((a) => (
                    <tr key={a._id}>
                      <td className="ps-4">
                        <div className="profile-cell-container">
                          <div className="profile-info">
                            <span
                              className="profile-name text-truncate"
                              style={{ maxWidth: "300px" }}
                              title={a.name}
                            >
                              {a.name}
                            </span>
                            <span className="profile-subtitle">
                              {a.eventDate
                                ? new Date(a.eventDate).toLocaleDateString(
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
                      <td>
                        {a.college ? (
                          <span
                            className={`modern-badge ${getBadgeClassOfCollege(a.college)}`}
                          >
                            {a.college}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-medium text-dark">{a.batch}</span>
                      </td>
                      <td>
                        <span className="modern-badge badge-category">
                          {a.category}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {/* Like */}
                          <div
                            className="d-flex align-items-center  text-muted small"
                            title="Likes"
                          >
                            <ThumbUpIcon
                              style={{ fontSize: "16px", color: "#64748b" }}
                            />
                            <span className="fw-semibold">
                              {a.reactions?.r1 || 0}
                            </span>
                          </div>
                          {/* Heart */}
                          <div
                            className="d-flex align-items-center  text-muted small"
                            title="Hearts"
                          >
                            <FavoriteIcon
                              style={{ fontSize: "16px", color: "#ef4444" }}
                            />
                            <span className="fw-semibold">
                              {a.reactions?.r2 || 0}
                            </span>
                          </div>
                          {/* Clap */}
                          <div
                            className="d-flex align-items-center  text-muted small"
                            title="Claps"
                          >
                            <CelebrationIcon
                              style={{ fontSize: "16px", color: "#eab308" }}
                            />
                            <span className="fw-semibold">
                              {a.reactions?.r3 || 0}
                            </span>
                          </div>
                          {/* Fire */}
                          <div
                            className="d-flex align-items-center  text-muted small"
                            title="Fire"
                          >
                            <LocalFireDepartmentIcon
                              style={{ fontSize: "16px", color: "#f97316" }}
                            />
                            <span className="fw-semibold">
                              {a.reactions?.r4 || 0}
                            </span>
                          </div>

                          <div
                            className="d-flex align-items-center  text-muted small"
                            title="Fire"
                          >
                            <LocalFireDepartmentIcon
                              style={{ fontSize: "16px", color: "#f97316" }}
                            />
                            <span className="fw-semibold">
                              {a.reactions?.r5 || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {a.students && a.students.length > 0 ? (
                          <Tooltip title="View Students">
                            <Button
                              variant="light"
                              className="action-btn mx-auto text-primary"
                              onClick={() =>
                                handleViewStudents(
                                  a.name,
                                  a.students,
                                  a.college,
                                )
                              }
                            >
                              <GroupsIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        ) : a.posterImage && a.posterImage !== "null" ? (
                          <Tooltip title="View Evidence">
                            <Button
                              variant="light"
                              className="action-btn mx-auto"
                              onClick={() =>
                                handleViewImage(a.name, a.posterImage)
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="status-wrapper">
                          <Form.Check
                            type="switch"
                            id={`status-${a._id}`}
                            checked={a.status}
                            onChange={() => handleStatusClick(a)}
                            style={{
                              cursor: "pointer",
                              margin: 0,
                              minHeight: "auto",
                            }}
                          />
                          <span
                            className={`status-label ${a.status ? "text-success" : "text-secondary"}`}
                          >
                            {a.status ? "Active" : "Closed"}
                          </span>
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Tooltip title="Edit" className="text-primary">
                            <button
                              className="action-btn edit"
                              onClick={() => onEdit(a)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete" className="text-danger">
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteClick(a._id, a.name)}
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
                    <td colSpan="8" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <div className="bg-light rounded-circle p-3 mb-3">
                          <SearchIcon
                            className="text-secondary opacity-50"
                            style={{ fontSize: "32px" }}
                          />
                        </div>
                        <h6 className="text-secondary fw-bold mb-1">
                          No achievements found
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

          {/* Pagination */}
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
        </>
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

      {/* Student List Modal */}
      {/* Student List Modal */}
      <Modal
        show={showStudentModal}
        onHide={handleCloseStudentModal}
        centered
        size="lg" // Can make this 'xl' if needed for 3 columns
        className="student-modal"
        contentClassName="border-0 shadow-lg"
        style={{ backdropFilter: "blur(5px)" }}
      >
        <div className="modal-header border-0 pb-0 pt-4 px-4 d-flex flex-column align-items-center justify-content-center position-relative">
          {/* Logo Section */}
          <div className="mb-3 text-center">
            <img
              src={
                selectedCollege === "KCE"
                  ? KCELogo
                  : selectedCollege === "KIT"
                    ? KITLogo 
                    : Logo
              }
              alt="Karpagam Institutions"
              style={{ height: "100px", objectFit: "contain" }}
            />
          </div>

          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={handleCloseStudentModal}
            aria-label="Close"
          ></button>
        </div>

        <Modal.Body className="p-4 pt-1">
          {/* Badge Section */}
          <div className="text-center mb-5">
            <div
              className="d-inline-block px-4 py-2 rounded-pill fw-bold text-uppercase shadow-sm"
              style={{
                letterSpacing: "1px",
                fontSize: "0.85rem",
                backgroundColor: "#fffbeb", 
                color: "#92400e", 
                border: "1px solid #fcd34d", 
              }}
            >
              🏆 Student Achievements
            </div>
          </div>

          <Row className="g-3 justify-content-center">
            {studentData.map((student, index) => {
              const avatarColor = getAvatarColor(student.name);
              
              const total = studentData.length;
              let colSize = 6; 
              if (total === 1)
                colSize = 8; 
              else if (total > 6) colSize = 4; 

              return (
                <Col md={colSize} key={student._id || index}>
                  <div
                    className="bg-white p-3 shadow-sm d-flex align-items-center position-relative h-100 border"
                    style={{
                      borderRadius: "24px",
                      borderColor: "rgba(0,0,0,0.05)",
                      transition: "transform 0.2s ease",
                    }}
                  >

                    <div
                      className="position-absolute bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center border"
                      style={{
                        width: "24px",
                        height: "24px",
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#64748b",
                        bottom: "8px",
                        left: "52px",
                        zIndex: 2,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-shrink-0 me-3">
                      {student.imageUrl ? (
                        <img
                          src={formatImageUrl(student.imageUrl)}
                          alt={student.name}
                          className="rounded-circle object-fit-cover shadow-sm border"
                          style={{ width: "60px", height: "60px" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                          style={{
                            width: "60px",
                            height: "60px",
                            fontSize: "1.5rem",
                            backgroundColor: avatarColor.bg,
                            color: avatarColor.text,
                          }}
                        >
                          {student.name ? student.name.charAt(0) : "S"}
                        </div>
                      )}
                    </div>

                    <div className="flex-grow-1 overflow-hidden">
                      <h6 className="mb-1 fw-bold text-dark text-truncate fs-6">
                        {student.name}
                      </h6>
                      <div className="d-flex align-items-center">
                        <span
                          className="fw-bold text-primary text-uppercase"
                          style={{
                            fontSize: "0.8rem",
                            letterSpacing: "0.5px",
                            color: "#4f46e5",
                          }}
                        >
                          {student.year}{" "}
                          <span className="mx-1 text-secondary opacity-50">
                            |
                          </span>{" "}
                          {student.dept}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

function getColorForCollege(college) {
  if (!college) return "#bdbdbd";
  switch (college.toUpperCase()) {
    case "KCE":
      return "#1976d2"; 
    case "KIT":
      return "#ed6c02"; 
    case "KAHE":
      return "#2e7d32"; 
    default:
      return "#9c27b0";
  }
}

function getBadgeClassOfCollege(college) {
  if (!college) return "bg-light text-dark"; 
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

function getAvatarColor(name) {
  if (!name) return { bg: "#e2e8f0", text: "#64748b" };

  const bgColors = [
    "#fee2e2", 
    "#ffedd5", 
    "#fef3c7", 
    "#dcfce7", 
    "#dbeafe", 
    "#e0e7ff", 
    "#fae8ff", 
    "#fce7f3", 
  ];

  const textColors = [
    "#ef4444", 
    "#f97316", 
    "#f59e0b", 
    "#22c55e", 
    "#3b82f6", 
    "#6366f1", 
    "#d946ef", 
    "#ec4899", 
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % bgColors.length;
  return { bg: bgColors[index], text: textColors[index] };
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
