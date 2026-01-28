import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

export default function AchieversForm({ initialData, onSave, onCancel }) {
  const isEditMode = !!initialData;
  const [entryType, setEntryType] = useState("image"); // image | manual
  const [studentCount, setStudentCount] = useState(0);

  const [form, setForm] = useState({
    name: "",
    batch: "",
    category: "",
    description: "",
    status: true,
    eventDate: "",
    posterImage: "",
    students: [],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        batch: initialData.batch || "",
        category: initialData.category || "",
        description: initialData.description || "",
        status: initialData.status !== undefined ? initialData.status : true,
        eventDate: initialData.eventDate ? initialData.eventDate.split("T")[0] : "",
        posterImage: initialData.posterImage || "",
        students: initialData.students || [],
      });

      if (initialData.students && initialData.students.length > 0) {
        setEntryType("manual");
        setStudentCount(initialData.students.length);
      } else {
        setEntryType("image");
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle student field change
  const handleStudentChange = (index, field, value) => {
    const updated = [...form.students];
    updated[index][field] = value;
    setForm({ ...form, students: updated });
  };

  // When number of students changes
  const handleStudentCount = (count) => {
    setStudentCount(count);
    // Preserve existing data if possible, else create new
    const oldStudents = form.students;
    const students = Array.from({ length: count }, (_, i) => 
      oldStudents[i] || { name: "", year: "", dept: "", imageUrl: "" }
    );
    setForm({ ...form, students });
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Card className="shadow border-0 mb-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="bg-white border-bottom p-4">
        <h5 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px' }}>
          {isEditMode ? "Edit Achievement" : "New Achievement Entry"}
        </h5>
        <p className="text-muted small mb-0 mt-1">Fill in the details for the student achievement record.</p>
      </div>
      <Card.Body className="p-4">
        <Form onSubmit={submit} className="needs-validation">
          
          {/* Section: Basic Info */}
          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2" style={{ letterSpacing: '1px' }}>
            Basic Information
          </h6>
          <Row className="mb-4">
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group controlId="formName">
                <Form.Label>Achievement Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter achievement name"
                  required
                  className="shadow-none"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3 mb-md-0">
               <Form.Group controlId="formBatch">
                <Form.Label>Batch</Form.Label>
                <Form.Control
                  type="text"
                  name="batch"
                  value={form.batch}
                  onChange={handleChange}
                  placeholder="e.g., 2024-2028"
                  className="shadow-none"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
               <Form.Group controlId="formCategory">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="shadow-none"
                  style={{ borderRadius: '6px' }}
                >
                  <option value="">Select Category</option>
                  <option>Academics</option>
                  <option>Placement</option>
                  <option>Hackathon</option>
                  <option>Sports</option>
                  <option>Others</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
             <Col md={12}>
               <Form.Group controlId="formDescription">
                <Form.Label>Description / Details</Form.Label>
                 <Form.Control
                   as="textarea"
                   name="description"
                   value={form.description}
                   onChange={handleChange}
                   placeholder="Enter detailed description"
                   style={{ height: '120px', borderRadius: '6px' }}
                   className="shadow-none"
                 />
              </Form.Group>
             </Col>
          </Row>

          <Row className="mb-4">
             <Col md={6} className="mb-3 mb-md-0">
               <Form.Group controlId="formEventDate">
                <Form.Label>Event Date</Form.Label>
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
             <Col md={6} className="d-flex align-items-center pt-4">
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

          {/* Section: Evidence / Data */}
          <h6 className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4" style={{ letterSpacing: '1px' }}>
            Record Evidence
          </h6>

          <div className="d-flex gap-4 mb-4">
            <Form.Check
              type="radio"
              label="Poster Image URL"
              name="entryType"
              id="typeImage"
              value="image"
              checked={entryType === "image"}
              onChange={() => setEntryType("image")}
              className="fw-medium small text-muted"
            />
            <Form.Check
              type="radio"
              label="Manual Student Entry"
              name="entryType"
              id="typeManual"
              value="manual"
              checked={entryType === "manual"}
              onChange={() => setEntryType("manual")}
              className="fw-medium small text-muted"
            />
          </div>

          <Row className="mb-4">
            <Col md={12}>
              {entryType === "image" && (
                <Form.Group controlId="formPosterImage">
                  <Form.Label>Poster Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="posterImage"
                    value={form.posterImage}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="shadow-none"
                    style={{ borderRadius: '6px' }}
                  />
                  {form.posterImage && (
                    <div className="mt-3 p-2 border rounded bg-light d-inline-block">
                         <img src={form.posterImage} alt="Preview" className="rounded" style={{maxHeight: '120px'}} />
                    </div>
                  )}
                </Form.Group>
              )}

              {entryType === "manual" && (
                <div>
                   <Form.Group controlId="formStudentCount" className="mb-3">
                    <Form.Label>Number of Students</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={studentCount || ""}
                      onChange={(e) => handleStudentCount(Number(e.target.value))}
                      placeholder="e.g. 5"
                      className="shadow-none"
                      style={{ maxWidth: '150px', borderRadius: '6px' }}
                    />
                  </Form.Group>
                  
                  {form.students.length > 0 && (
                     <div className="border rounded bg-white">
                       <div className="table-responsive">
                         <table className="table table-sm table-borderless mb-0 align-middle">
                           <thead className="bg-light border-bottom">
                             <tr>
                               <th className="ps-3 text-muted small text-uppercase">#</th>
                               <th className="text-muted small text-uppercase">Name</th>
                               <th className="text-muted small text-uppercase">Year</th>
                               <th className="text-muted small text-uppercase">Dept</th>
                               <th className="text-muted small text-uppercase">Photo URL</th>
                             </tr>
                           </thead>
                           <tbody>
                             {form.students.map((student, index) => (
                               <tr key={index} className="border-bottom">
                                  <td className="ps-3 fw-bold text-muted">{index+1}</td>
                                  <td>
                                    <Form.Control 
                                      size="sm" 
                                      placeholder="Name" 
                                      value={student.name}
                                      onChange={(e) => handleStudentChange(index, "name", e.target.value)}
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control 
                                      size="sm" 
                                      placeholder="Year"
                                      value={student.year}
                                      onChange={(e) => handleStudentChange(index, "year", e.target.value)} 
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control 
                                      size="sm" 
                                      placeholder="Dept"
                                      value={student.dept}
                                      onChange={(e) => handleStudentChange(index, "dept", e.target.value)} 
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control 
                                      size="sm" 
                                      placeholder="URL"
                                      value={student.imageUrl}
                                      onChange={(e) => handleStudentChange(index, "imageUrl", e.target.value)} 
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     </div>
                  )}
                </div>
              )}
            </Col>
          </Row>

          {/* Actions */}
          <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-5">
             <Button variant="light" onClick={onCancel} className="px-4 fw-medium border">
               Cancel
             </Button>
             <Button variant="primary" type="submit" className="px-4 fw-medium">
               {isEditMode ? "Save Changes" : "Create Record"}
             </Button>
          </div>
          
        </Form>
      </Card.Body>
    </Card>
  );
}