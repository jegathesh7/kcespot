import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import UsersTable from "./UsersTable";
//import "./users.css";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Set from backend
  const itemsPerPage = 10;

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          college: filterCollege,
        },
      });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterCollege]);

  const handleEdit = (user) => {
    setEditingItem(user);
    setActiveTab("form");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/users/${editingItem._id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setActiveTab("list");
      setEditingItem(null);
      loadUsers();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save user");
    }
  };

  const handleCancel = () => {
    setActiveTab("list");
    setEditingItem(null);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">User Management</h2>
          <p className="text-muted small mb-0">Manage registered users</p>
        </div>
      </div>

      <Nav
        variant="pills"
        className="modern-tabs mb-4"
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          if (k === "list") setEditingItem(null);
        }}
      >
        <Nav.Item>
          <Nav.Link eventKey="list" className="fw-bold px-4">
            View List
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === "list" && (
        <UsersTable
          data={users}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          // Pagination & Filtering Props
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1); // Reset page on search
          }}
          filterCollege={filterCollege}
          onFilterChange={(val) => {
            setFilterCollege(val);
            setCurrentPage(1); // Reset page on filter
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {activeTab === "form" && (
        <UsersForm
          initialData={editingItem}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </Container>
  );
}
