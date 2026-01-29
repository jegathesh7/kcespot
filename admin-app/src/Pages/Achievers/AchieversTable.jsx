import { useState } from "react";
import { Table, Badge, Button, Image, Modal, Form } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TablePlaceholder from "../../component/TablePlaceholder";
export default function AchieversTable({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  // Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusItem, setStatusItem] = useState(null);

  // Image Modal State
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

  const handleDeleteClick = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setShowDeleteModal(true);
  };

  const handleStatusClick = (item) => {
    setStatusItem(item);
    setShowStatusModal(true);
  };

  const confirmStatusToggle = () => {
    if (statusItem) {
      onStatusToggle(statusItem._id, statusItem.status);
      setShowStatusModal(false);
      setStatusItem(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId); // Pass ID to parent handler
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  if (loading) {
    return <TablePlaceholder/>
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-5 text-muted">No achievements found.</div>
    );
  }

  return (
    <>
      <div className="table-responsive bg-white rounded shadow-sm border">
        <Table hover className="mb-0 align-middle">
          <thead className="bg-light">
            <tr>
              <th className="py-3 ps-4 text-secondary small text-uppercase fw-bold">
                Achievement Info
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Batch
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Category
              </th>
              <th className="py-3 text-secondary small text-uppercase fw-bold">
                Evidence
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
            {data.map((a) => (
              <tr key={a._id}>
                <td className="ps-4">
                  {a.college && (
                    <Badge bg="light" className="text-primary border mb-1">
                      {a.college}
                    </Badge>
                  )}
                  <div className="fw-bold text-dark">{a.name}</div>
                  {a.eventDate && (
                    <div className="small text-muted">
                      {new Date(a.eventDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td className="text-secondary small fw-medium">{a.batch}</td>
                <td>
                  <Badge bg="info" className="text-white bg-opacity-75">
                    {a.category}
                  </Badge>
                </td>
                <td>
                  {a.posterImage ? (
                    <Button
                      variant="light"
                      size="sm"
                      className="text-secondary border-0"
                      onClick={() => handleViewImage(a.name, a.posterImage)}
                      title="View Poster"
                    >
                      <VisibilityIcon fontSize="small" />
                    </Button>
                  ) : (
                    <span className="text-muted small italic">No Image</span>
                  )}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Form.Check
                      type="switch"
                      id={`status-${a._id}`}
                      checked={a.status}
                      onChange={() => handleStatusClick(a)}
                      className="custom-switch"
                      style={{ cursor: "pointer" }}
                    />
                    <Badge
                      bg={a.status ? "success" : "secondary"}
                      pill
                      className="text-uppercase"
                      style={{ fontSize: "0.7rem", minWidth: "60px" }}
                    >
                      {a.status ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </td>
                <td className="pe-4 text-end">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary p-0 me-3"
                    onClick={() => onEdit(a)}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={() => handleDeleteClick(a._id, a.name)}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

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
          Are you sure you want to delete the achievement record for{" "}
          <strong>{deleteName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete Item
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Current Status:{" "}
            <strong
              className={statusItem?.status ? "text-success" : "text-secondary"}
            >
              {statusItem?.status ? "Active" : "Closed"}
            </strong>
          </p>
          <p className="mb-0">
            Do you want to change the status to{" "}
            <strong>{statusItem?.status ? "Closed" : "Active"}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button
            variant={statusItem?.status ? "secondary" : "success"} // Color based on target action
            onClick={confirmStatusToggle}
          >
            Mark as {statusItem?.status ? "Closed" : "Active"}
          </Button>
        </Modal.Footer>
      </Modal>

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
      // Return a thumbnail URL which is more reliable for embedding (sz=w1000 requests a large 1000px wide image)
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }

  return url;
}
