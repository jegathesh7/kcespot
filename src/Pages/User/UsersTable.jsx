import React, { useState } from "react";
import { Table, Badge, Button, Form, Pagination } from "react-bootstrap";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TablePlaceholder from "../../component/TablePlaceholder";

export default function UsersTable({
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
}) {
  const getBadgeClassOfCollege = (college) => {
    switch (college) {
      case "KCE":
        return "badge-college-kce";
      case "KIT":
        return "badge-college-kit";
      case "KAHE":
        return "badge-college-kahe";
      default:
        return "badge-category";
    }
  };

  return (
    <>
      {/* Professional Toolbar */}
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="position-relative w-50" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
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
        </div>
      </div>

      {loading ? (
        <TablePlaceholder />
      ) : (
        <>
          <div className="modern-card table-responsive">
            <Table className="custom-table mb-0 align-middle text-center">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "15%" }}>
                    User Details
                  </th>
                  <th style={{ width: "25%" }}>College</th>
                  <th style={{ width: "25%" }}>Email</th>
                  <th style={{ width: "10%" }}>Role</th>
                 
                  {/* <th className="text-end pe-4" style={{ width: "15%" }}>
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((u) => (
                    <tr key={u._id}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark d-block">
                          {u.name}
                        </span>
                      
                      </td>
                      <td>
                        {u.collegeName ? (
                          <span
                            className={`modern-badge ${getBadgeClassOfCollege(u.collegeName)}`}
                          >
                            {u.collegeName}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="text-secondary fw-medium">
                          {u.email}
                        </span>
                      </td>
                      <td>
                        <span className="text-dark small fw-bold text-uppercase">
                          {u.role || "User"}
                        </span>
                      </td>
                      
                      {/* <td className="text-end pe-4">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="action-btn text-primary"
                            onClick={() => onEdit(u)}
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="action-btn text-danger"
                            onClick={() => onDelete(u._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FilterListIcon
                          style={{ fontSize: "48px" }}
                          className="text-muted opacity-25 mb-3"
                        />
                        <h6 className="text-secondary fw-bold mb-1">
                          No users found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search or filters
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
    </>
  );
}
