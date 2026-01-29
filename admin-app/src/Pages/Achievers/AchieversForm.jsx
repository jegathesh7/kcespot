import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const AchieversForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [entryType, setEntryType] = useState("image"); // image | manual
    const [studentCount, setStudentCount] = useState(0);

    const [form, setForm] = useState({
      name: "",
      college: "",
      batch: "",
      category: "",
      description: "",
      status: true,
      eventDate: "",
      posterImage: "",
      students: [],
    });

    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (validate()) {
          onSave(form);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => {
      if (initialData) {
        // ... existing initialization logic ...
        setForm({
          name: initialData.name || "",
          college: initialData.college || "",
          batch: initialData.batch || "",
          category: initialData.category || "",
          description: initialData.description || "",
          status: initialData.status !== undefined ? initialData.status : true,
          eventDate: initialData.eventDate
            ? initialData.eventDate.split("T")[0]
            : "",
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
      // Clear error for this field
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }
      if (setIsDirty) setIsDirty(true);
    };

    // ... handleStudentChange and handleStudentCount ...

    const handleStudentChange = (index, field, value) => {
      const updated = [...form.students];
      updated[index][field] = value;
      setForm({ ...form, students: updated });
      if (setIsDirty) setIsDirty(true);
    };

    const handleStudentCount = (count) => {
      setStudentCount(count);
      const oldStudents = form.students;
      const students = Array.from(
        { length: count },
        (_, i) =>
          oldStudents[i] || { name: "", year: "", dept: "", imageUrl: "" },
      );
      setForm({ ...form, students });
      if (setIsDirty) setIsDirty(true);
    };

    const validate = () => {
      const newErrors = {};
      if (!form.name.trim()) newErrors.name = "Achievement Name is required";
      if (!form.college.trim()) newErrors.college = "College Name is required";
      if (!form.category) newErrors.category = "Category is required";
      if (!form.batch.trim()) newErrors.batch = "Batch is required";
      if (!form.description.trim())
        newErrors.description = "Description is required";

      if (entryType === "image" && !form.posterImage.trim()) {
        newErrors.evidence = "Poster Image URL is required";
      }

      if (entryType === "manual") {
        if (studentCount <= 0) {
          newErrors.evidence = "Please add at least one student";
        } else {
          // Check for empty required fields in students array
          const invalidStudents = form.students.some(
            (s) => !s.name.trim() || !s.year.trim() || !s.dept.trim(),
          );

          if (invalidStudents) {
            newErrors.evidence =
              "Please fill all required fields (Name, Year, Dept) for all students";
            newErrors.studentErrors = true; // Flag to highlight inputs
          }
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
      e.preventDefault();
      if (validate()) {
        onSave(form);
      }
    };

    return (
      <Card
        className="shadow border-0 mb-4"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="bg-white border-bottom p-4">
          <h5
            className="mb-0 fw-bold text-dark"
            style={{ letterSpacing: "0.5px" }}
          >
            {isEditMode ? "Edit Achievement" : "New Achievement Entry"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Fill in the details for the student achievement record.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={submit} className="needs-validation">
            {/* Section: Basic Info */}
            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2"
              style={{ letterSpacing: "1px" }}
            >
              Basic Information
            </h6>
            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="formName">
                  <Form.Label>
                    Achievement Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter achievement name"
                    isInvalid={!!errors.name}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="formCollege">
                  <Form.Label>
                    College Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    isInvalid={!!errors.college}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select College</option>
                    <option value="KCE">KCE</option>
                    <option value="KIT">KIT</option>
                    <option value="KAHE">KAHE</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.college}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formBatch">
                  <Form.Label>
                    Batch <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    placeholder="e.g., 2026"
                    isInvalid={!!errors.batch}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.batch}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formCategory">
                  <Form.Label>
                    Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    isInvalid={!!errors.category}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Category</option>
                    <option>Academics</option>
                    <option>Placement</option>
                    <option>Hackathon</option>
                    <option>Sports</option>
                    <option>Others</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formEventDate">
                  <Form.Label>Event Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formDescription">
                  <Form.Label>
                    Description / Details <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter detailed description"
                    isInvalid={!!errors.description}
                    style={{ height: "120px", borderRadius: "6px" }}
                    className="shadow-none"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-4">
              <Form.Check
                type="switch"
                id="status-switch"
                label="Active Status"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="fs-6 fw-medium"
              />
            </div>

            {/* Section: Evidence / Data */}
            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4"
              style={{ letterSpacing: "1px" }}
            >
              Record Evidence <span className="text-danger">*</span>
            </h6>

            {errors.evidence && (
              <div className="alert alert-danger py-2 small mb-3">
                {errors.evidence}
              </div>
            )}

            <div className="d-flex gap-4 mb-4">
              <Form.Check
                type="radio"
                label="Poster Image URL"
                name="entryType"
                id="typeImage"
                value="image"
                checked={entryType === "image"}
                onChange={() => {
                  setEntryType("image");
                  setIsDirty && setIsDirty(true);
                }}
                className="fw-medium small text-muted"
              />
              <Form.Check
                type="radio"
                label="Manual Student Entry"
                name="entryType"
                id="typeManual"
                value="manual"
                checked={entryType === "manual"}
                onChange={() => {
                  setEntryType("manual");
                  setIsDirty && setIsDirty(true);
                }}
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
                      style={{ borderRadius: "6px" }}
                    />
                    {form.posterImage && (
                      <div className="mt-3 p-2 border rounded bg-light d-inline-block">
                        <img
                          src={formatImageUrl(form.posterImage)}
                          alt="Preview"
                          className="rounded"
                          style={{ maxHeight: "120px" }}
                        />
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
                        onChange={(e) =>
                          handleStudentCount(Number(e.target.value))
                        }
                        placeholder="e.g. 5"
                        className="shadow-none"
                        style={{ maxWidth: "150px", borderRadius: "6px" }}
                      />
                    </Form.Group>

                    {form.students.length > 0 && (
                      <div className="border rounded bg-white">
                        <div className="table-responsive">
                          <table className="table table-sm table-borderless mb-0 align-middle">
                            <thead className="bg-light border-bottom">
                              <tr>
                                <th className="ps-3 text-muted small text-uppercase">
                                  #
                                </th>
                                <th className="text-muted small text-uppercase">
                                  Name <span className="text-danger">*</span>
                                </th>
                                <th className="text-muted small text-uppercase">
                                  Year <span className="text-danger">*</span>
                                </th>
                                <th className="text-muted small text-uppercase">
                                  Dept <span className="text-danger">*</span>
                                </th>
                                <th className="text-muted small text-uppercase">
                                  Photo URL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.students.map((student, index) => (
                                <tr key={index} className="border-bottom">
                                  <td className="ps-3 fw-bold text-muted">
                                    {index + 1}
                                  </td>
                                  <td>
                                    <Form.Control
                                      size="sm"
                                      placeholder="Name"
                                      value={student.name}
                                      onChange={(e) =>
                                        handleStudentChange(
                                          index,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                      isInvalid={
                                        errors.studentErrors &&
                                        !student.name.trim()
                                      }
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      size="sm"
                                      placeholder="Year"
                                      value={student.year}
                                      onChange={(e) =>
                                        handleStudentChange(
                                          index,
                                          "year",
                                          e.target.value,
                                        )
                                      }
                                      isInvalid={
                                        errors.studentErrors &&
                                        !student.year.trim()
                                      }
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      size="sm"
                                      placeholder="Dept"
                                      value={student.dept}
                                      onChange={(e) =>
                                        handleStudentChange(
                                          index,
                                          "dept",
                                          e.target.value,
                                        )
                                      }
                                      isInvalid={
                                        errors.studentErrors &&
                                        !student.dept.trim()
                                      }
                                      className="border-0 bg-transparent"
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      size="sm"
                                      placeholder="URL"
                                      value={student.imageUrl}
                                      onChange={(e) =>
                                        handleStudentChange(
                                          index,
                                          "imageUrl",
                                          e.target.value,
                                        )
                                      }
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
              <Button
                variant="light"
                onClick={onCancel}
                className="px-4 fw-medium border"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-4 fw-medium"
              >
                {isEditMode ? "Save Changes" : "Create Record"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

export default AchieversForm;

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
