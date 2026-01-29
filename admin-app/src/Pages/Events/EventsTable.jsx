import { useState } from "react";
import {
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Placeholder,
} from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePlaceholder from "../../component/TablePlaceholder";
export default function EventsTable({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

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

  const handleDeleteClick = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteTitle("");
    }
  };

  if (loading) {
    return <TablePlaceholder />
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-5 text-muted">No events found.</div>;
  }

  return (
    <>
      <div className="table-responsive bg-white rounded shadow-sm border">
        <Table hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 ps-4 text-secondary small text-uppercase fw-bold">
                Title
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Location
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Classification
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Poster
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Visibility
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold text-center">
                Status
              </th>
              <th className="py-3 pe-4 text-end text-secondary small text-uppercase fw-bold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e._id}>
                <td className="ps-4">
                  <div className="fw-bold text-dark">{e.title}</div>
                  <div className="small text-muted">
                    {e.eventDate
                      ? new Date(e.eventDate).toLocaleDateString()
                      : "No Date"}
                  </div>
                </td>
                <td>
                  <div className="text-dark small">{e.campus}</div>
                  <div className="text-muted small">{e.venue}</div>
                </td>
                <td>
                  <Badge bg="light" text="dark" className="border me-1">
                    {e.mode}
                  </Badge>
                  <span className="small text-muted">{e.type}</span>
                </td>
                <td>
                  {e.eventImage ? (
                    <Button
                      variant="light"
                      size="sm"
                      className="text-secondary border-0"
                      onClick={() => handleViewImage(e.title, e.eventImage)}
                      title="View Poster"
                    >
                      <VisibilityIcon fontSize="small" />
                    </Button>
                  ) : (
                    <span className="text-muted small italic">No Image</span>
                  )}
                </td>
                <td>
                  <span className="small fw-medium">{e.visibility}</span>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Form.Check
                      type="switch"
                      id={`status-${e._id}`}
                      checked={e.status}
                      onChange={() => onStatusToggle(e._id, e.status)}
                      className="custom-switch"
                      style={{ cursor: "pointer" }}
                    />
                    <Badge bg={e.status ? "success" : "secondary"} pill>
                      {e.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </td>
                <td className="pe-4 text-end">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary p-0 me-3"
                    onClick={() => onEdit(e)}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={() => handleDeleteClick(e._id, e.title)}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Image Preview Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h6">{selectedTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedImage ? (
            <img
              src={formatImageUrl(selectedImage)}
              alt={selectedTitle}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <p className="p-4 text-muted">No Image Available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the event{" "}
          <strong>{deleteTitle}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Helper to fix Google Drive image links for embedding
function formatImageUrl(url) {
  if (!url) return "";

  // Check if it is a Google Drive link
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    // Try to extract the ID
    let id = "";
    const parts = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);

    if (parts) {
      id = parts[1] || parts[2];
    }

    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }

  return url;
}
