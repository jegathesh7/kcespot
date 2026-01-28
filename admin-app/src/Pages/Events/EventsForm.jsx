import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

export default function EventsForm({ initialData, onSave, onCancel }) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    campus: "",
    venue: "",
    mode: "",
    organizer: "",
    type: "",
    visibility: "",
    targetAudience: "",
    status: true,
    eventDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        startDate: initialData.startDate ? initialData.startDate.split("T")[0] : "",
        endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
        campus: initialData.campus || "",
        venue: initialData.venue || "",
        mode: initialData.mode || "",
        organizer: initialData.organizer || "",
        type: initialData.type || "",
        visibility: initialData.visibility || "",
        targetAudience: initialData.targetAudience || "",
        status: initialData.status !== undefined ? initialData.status : true,
        eventDate: initialData.eventDate ? initialData.eventDate.split("T")[0] : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    onSave(fd);
  };

  return (
    <Card className="shadow border-0 mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="bg-white border-bottom p-4">
        <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px' }}>
          {isEditMode ? "Edit Event Details" : "New Event Details"}
        </h5>
        <p className="text-muted small mb-0 mt-1">Manage event scheduling and classification.</p>
      </div>
      <Card.Body className="p-4">
        <Form onSubmit={submit}>
          
          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2" style={{ letterSpacing: '1px' }}>
            General Information
          </h6>
          <Row className="mb-4">
            <Col md={12}>
              <Form.Group controlId="formTitle">
                <Form.Label>Event Title <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  name="title" 
                  value={form.title}
                  placeholder="Enter event title" 
                  onChange={handleChange} 
                  required 
                  className="shadow-none"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Group>
            </Col>
          </Row>

           <Row className="mb-4">
             <Col md={12}>
              <Form.Group controlId="formDescription">hv
                 <Form.Label>Description</Form.Label>
                 <Form.Control
                   as="textarea"
                   name="description"
                   value={form.description}
                   onChange={handleChange}
                   placeholder="Enter event description"
                   style={{ height: '120px', borderRadius: '6px' }}
                   className="shadow-none"
                 />
              </Form.Group>
             </Col>
          </Row>

          <Row className="mb-4">
             <Col md={6} className="mb-3 mb-md-0">
               <Form.Group controlId="formOrganizer">
                 <Form.Label>Organizer</Form.Label>
                 <Form.Control 
                   name="organizer" 
                   value={form.organizer}
                   placeholder="e.g. Dept of CSE" 
                   onChange={handleChange} 
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
             <Col md={6}>
               <Form.Group controlId="formTargetAudience">
                 <Form.Label>Target Audience</Form.Label>
                 <Form.Control 
                   name="targetAudience" 
                   value={form.targetAudience}
                   placeholder="e.g. Final Year Students" 
                   onChange={handleChange} 
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
          </Row>

          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4" style={{ letterSpacing: '1px' }}>
            Schedule & Location
          </h6>
          <Row className="mb-4">
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formStartDate">
                 <Form.Label>Start Date</Form.Label>
                 <Form.Control 
                   type="date" 
                   name="startDate" 
                   value={form.startDate}
                   onChange={handleChange} 
                   onClick={(e) => e.target.showPicker && e.target.showPicker()}
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formEndDate">
                 <Form.Label>End Date</Form.Label>
                 <Form.Control 
                   type="date" 
                   name="endDate" 
                   value={form.endDate}
                   onChange={handleChange} 
                   onClick={(e) => e.target.showPicker && e.target.showPicker()}
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
             <Col md={4}>
               <Form.Group controlId="formEventDate">
                 <Form.Label>Event Date (One-time)</Form.Label>
                 <Form.Control 
                   type="date" 
                   name="eventDate" 
                   value={form.eventDate}
                   onChange={handleChange} 
                   onClick={(e) => e.target.showPicker && e.target.showPicker()}
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
          </Row>

          <Row className="mb-4">
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formCampus">
                 <Form.Label>Campus</Form.Label>
                 <Form.Control 
                   name="campus" 
                   value={form.campus}
                   placeholder="Enter campus" 
                   onChange={handleChange} 
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formVenue">
                 <Form.Label>Venue</Form.Label>
                 <Form.Control 
                   name="venue" 
                   value={form.venue}
                   placeholder="Enter venue" 
                   onChange={handleChange} 
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 />
               </Form.Group>
             </Col>
             <Col md={4}>
               <Form.Group controlId="formMode">
                 <Form.Label>Mode</Form.Label>
                 <Form.Select 
                   name="mode" 
                   value={form.mode}
                   onChange={handleChange} 
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 >
                   <option value="">Select Mode</option>
                   <option>Online</option>
                   <option>Offline</option>
                 </Form.Select>
               </Form.Group>
             </Col>
          </Row>

          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4" style={{ letterSpacing: '1px' }}>
            Classification & Status
          </h6>
           <Row className="mb-4">
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formType">
                 <Form.Label>Event Type</Form.Label>
                 <Form.Select 
                   name="type" 
                   value={form.type}
                   onChange={handleChange}
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 >
                   <option value="">Select Type</option>
                   <option>Workshop</option>
                   <option>Competition</option>
                   <option>Hackathon</option>
                   <option>Cultural</option>
                   <option>Seminar</option>
                   <option>Others</option>
                 </Form.Select>
               </Form.Group>
             </Col>
             <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formVisibility">
                 <Form.Label>Visibility</Form.Label>
                 <Form.Select 
                   name="visibility" 
                   value={form.visibility}
                   onChange={handleChange}
                   className="shadow-none"
                   style={{ borderRadius: '6px' }}
                 >
                   <option value="">Select Visibility</option>
                   <option>KCE</option>
                   <option>KIT</option>
                   <option>KAHE</option>
                   <option>All Colleges</option>
                 </Form.Select>
                </Form.Group>
             </Col>
             <Col md={4} className="d-flex align-items-center pt-4">
                <Form.Check 
                  type="switch"
                  id="status-switch"
                  label="Active Status"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  className="fs-6 fw-medium ms-2"
                />
             </Col>
           </Row>

           <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-5">
              <Button variant="light" onClick={onCancel} className="px-4 fw-medium border">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="px-4 fw-medium">
                {isEditMode ? "Save Details" : "Create Event"}
              </Button>
           </div>
        </Form>
      </Card.Body>
    </Card>
  );
}