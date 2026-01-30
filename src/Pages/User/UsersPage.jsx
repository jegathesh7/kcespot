import { useEffect, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import UsersTable from "./UsersTable";
import Swal from "sweetalert2";
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
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/${id}`);
          loadUsers();
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
            title: "User has been deleted.",
          });
        } catch (err) {
          console.error("Delete failed", err);
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/users/${editingItem._id}`, formData);
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
          title: "User updated successfully!",
        });
      } else {
        await api.post("/users", formData);
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
          title: "User created successfully!",
        });
      }
      setActiveTab("list");
      setEditingItem(null);
      loadUsers();
    } catch (err) {
      console.error("Save failed", err);
      Swal.fire("Error", "Failed to save user", "error");
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
