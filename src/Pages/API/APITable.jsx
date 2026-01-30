import React from "react";
import { Table, Pagination, Badge, Form } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import TablePlaceholder from "../../component/TablePlaceholder";

export default function APITable({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
}) {
  

  return (
    <>
      {/* Toolbar */}
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="position-relative w-50" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2"
          />
        </div>
      </div>
    {loading ?
    (
      <TablePlaceholder/>
    ) : (
      <>
      <div className="modern-card table-responsive">
        <Table className="custom-table mb-0 align-middle">
          <thead>
            <tr>
              <th className="ps-4" style={{ width: "10%" }}>
                Logo
              </th>
              <th style={{ width: "25%" }}>Title</th>
              <th style={{ width: "25%" }}>Organization</th>
              <th style={{ width: "15%" }}>Registration</th>
              <th style={{ width: "15%" }}>Time Left</th>
              <th className="text-end pe-4" style={{ width: "10%" }}>
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={
                          item.logoUrl2 ||
                          item.organisation?.logoUrl2 ||
                          "https://via.placeholder.com/50"
                        }
                        alt="Logo"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50";
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span
                      className="fw-bold text-dark d-block text-truncate"
                      style={{ maxWidth: "250px" }}
                      title={item.title}
                    >
                      {item.title}
                    </span>
                    <span className="small text-muted">ID: {item.id}</span>
                  </td>
                  <td>
                    <span className="text-secondary fw-medium">
                      {item.organisation?.name || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <Badge
                      bg={item.regn_open ? "success" : "danger"}
                      className="px-2 py-1"
                    >
                      {item.regn_open ? "Open" : "Closed"}
                    </Badge>
                  </td>
                  <td>
                    <span className="small fw-semibold text-dark">
                      {item.regnRequirements?.remain_days || "N/A"}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <a
                      href={`https://unstop.com/${item.public_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-light btn-sm text-primary"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center p-4">
                    <h6 className="text-secondary fw-bold mb-1">
                      No opportunities found
                    </h6>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className="shadow-sm">
            <Pagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {/* Show limited page numbers to avoid overflow */}
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              // Logic to show pages around current page could be added here
              // For simplicity, showing first 5 or logic can be improved
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                // cap at total pages
                if (pageNum > totalPages) return null;
              }

              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <Pagination.Ellipsis />
            )}
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
