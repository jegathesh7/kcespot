import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import api from "../../api/axios";
import APITable from "./APITable";
import "./api.css"; // We might need to create this or reuse existing styles

export default function APIPage() {
  const [activeTab, setActiveTab] = useState("hackathons");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm,setSearchTerm] = useState("");
  // Constants for API
  // Using a proxy or direct call? Trying direct call first.
  // Note: Unstop API might have CORS. If it fails, we need to handle it.

  const loadData = async () => {
    setLoading(true);
    try {
      // Determine opportunity type based on tab
      const opportunityType = activeTab; // 'hackathons' or 'competitions'

      const response = await api.get("/unstop/opportunities", {
        params: {
          opportunity: opportunityType,
          page: currentPage,
          per_page: 18,
          oppstatus: "open",
          usertype: "students",
          domain: 2,
          q: searchTerm,
          undefined: true,
        },
      });

      if (response.data && response.data.data) {
        // Unstop API structure based on user input:
        // { data: { current_page: 1, data: [...], total: 54, per_page: 18, to: 18 } }
        const result = response.data.data;
        setData(result.data);
        // Calculate total pages
        const total = result.total || 0;
        const perPage = result.per_page || 18;
        setTotalPages(Math.ceil(total / perPage));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data from Unstop", error);
      // In case of CORS error, we might show a message or use sample data for demo?
      // For now, let's alert only on console
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
  }, [activeTab, currentPage, searchTerm]);

  const handleTabSelect = (k) => {
    setActiveTab(k);
    setCurrentPage(1); // Reset to page 1 on tab switch
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">External Opportunities</h2>
          <p className="text-muted small mb-0">
            Browse Hackathons and Competitions from Unstop
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
          <Nav.Link eventKey="hackathons" className="px-4">
            Hackathons
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="competitions" className="px-4">
            Competitions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <APITable
        data={data}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </Container>
  );
}
