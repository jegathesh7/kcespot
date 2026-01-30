import React from 'react'
import { Container } from 'react-bootstrap'

const AnnouncementPage = () => {
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold color2 mb-0">Announcement Management</h2>
          <p className="text-muted small mb-0">
            Manage announcements
          </p>
        </div>
      </div>
    </Container>
  )
}

export default AnnouncementPage