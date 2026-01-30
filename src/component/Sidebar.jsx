import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar bg-white border-end h-100 pt-3">
        <Nav className="flex-column gap-2 px-2">
            <Nav.Link as={NavLink} to="/achievers" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Achievers</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/events" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Events</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/users" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Users</span>
            </Nav.Link>
            {/* <Nav.Link as={NavLink} to="/announcements" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Announcements</span>
            </Nav.Link> */}
            <Nav.Link as={NavLink} to="/api-integration" className="sidebar-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none">
                 <span className="fw-medium">Third Party API</span>
            </Nav.Link>
        </Nav>
    </div>
  );
}
export default Sidebar;
