import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const EventsForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

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
      eventImage: "",
    });

    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        if (validate()) {
          setIsSubmitting(true);
          try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
              if (key === "eventImage") {
                if (form[key] instanceof File) {
                  formData.append("eventImage", form[key]);
                }
              } else {
                formData.append(key, form[key]);
              }
            });
            await onSave(formData);
            return true;
          } catch (error) {
            console.error("External submit failed", error);
            return false;
          } finally {
            setIsSubmitting(false);
          }
        }
        return false;
      },
    }));

    const validate = () => {
      const newErrors = {};
      if (!form.title.trim()) newErrors.title = "Event Title is required";
      if (!form.description.trim())
        newErrors.description = "Description is required";
      if (!form.startDate) newErrors.startDate = "Start Date is required";
      if (!form.endDate) newErrors.endDate = "End Date is required";
      if (!form.eventDate) newErrors.eventDate = "Event Date is required";
      if (!form.campus) newErrors.campus = "Campus is required";
      if (!form.venue.trim()) newErrors.venue = "Venue is required";
      if (!form.mode) newErrors.mode = "Mode is required";
      if (!form.organizer.trim()) newErrors.organizer = "Organizer is required";
      if (!form.type) newErrors.type = "Event Type is required";
      if (!form.visibility) newErrors.visibility = "Visibility is required";
      if (!form.targetAudience.trim())
        newErrors.targetAudience = "Target Audience is required";
      if (!form.eventImage || form.eventImage === "") {
        newErrors.eventImage = "Event Image is required";
      }

      if (
        form.startDate &&
        form.endDate &&
        new Date(form.startDate) > new Date(form.endDate)
      ) {
        newErrors.endDate = "End Date cannot be before Start Date";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
      if (initialData) {
        setForm({
          title: initialData.title || "",
          description: initialData.description || "",
          startDate: initialData.startDate
            ? initialData.startDate.split("T")[0]
            : "",
          endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
          campus: initialData.campus || "",
          venue: initialData.venue || "",
          mode: initialData.mode || "",
          organizer: initialData.organizer || "",
          type: initialData.type || "",
          visibility: initialData.visibility || "",
          targetAudience: initialData.targetAudience || "",
          status: initialData.status !== undefined ? initialData.status : true,
          eventDate: initialData.eventDate
            ? initialData.eventDate.split("T")[0]
            : "",
          eventImage: initialData.eventImage || "",
        });
      }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      setForm({
        ...form,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files[0] : value,
      });

      // Clear error
      if (errors[name]) {
        setErrors({ ...errors, [name]: null });
      }

      if (setIsDirty) setIsDirty(true);
    };

    // We expose submit via ref, so internal submit is for standard button click
    // But we want to prevent default form submission if wrapped in <form>
    const handleInternalSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        setIsSubmitting(true);
        try {
          const formData = new FormData();
          Object.keys(form).forEach((key) => {
            if (key === "eventImage") {
              if (form[key] instanceof File) {
                formData.append("eventImage", form[key]);
              }
            } else {
              formData.append(key, form[key]);
            }
          });
          await onSave(formData);
        } catch (error) {
          console.error("Submission failed", error);
        } finally {
          setIsSubmitting(false);
        }
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
            {isEditMode ? "Edit Event Details" : "New Event Details"}
          </h5>
          <p className="text-muted small mb-0 mt-1">
            Manage event scheduling and classification.
          </p>
        </div>
        <Card.Body className="p-4">
          <Form onSubmit={handleInternalSubmit}>
            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2"
              style={{ letterSpacing: "1px" }}
            >
              General Information
            </h6>
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formTitle">
                  <Form.Label>
                    Event Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    placeholder="Enter event title"
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formDescription">
                  <Form.Label>
                    Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter event description"
                    style={{ height: "120px", borderRadius: "6px" }}
                    isInvalid={!!errors.description}
                    className="shadow-none"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6} className="mb-3 mb-md-0">
                <Form.Group controlId="formOrganizer">
                  <Form.Label>
                    Organizer <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="organizer"
                    value={form.organizer}
                    placeholder="e.g. Dept of CSE"
                    onChange={handleChange}
                    isInvalid={!!errors.organizer}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizer}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTargetAudience">
                  <Form.Label>
                    Target Audience <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="targetAudience"
                    value={form.targetAudience}
                    placeholder="e.g. Final Year Students"
                    onChange={handleChange}
                    isInvalid={!!errors.targetAudience}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.targetAudience}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4"
              style={{ letterSpacing: "1px" }}
            >
              Event Poster / Image
            </h6>
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="formEventImage">
                  <Form.Label>
                    Event Image <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="eventImage"
                    onChange={handleChange}
                    accept="image/*"
                    isInvalid={!!errors.eventImage}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventImage}
                  </Form.Control.Feedback>
                  {form.eventImage && (
                    <div className="mt-3 p-2 border rounded bg-light d-inline-block">
                      <img
                        src={
                          typeof form.eventImage === "string"
                            ? form.eventImage.startsWith("http")
                              ? form.eventImage
                              : `${import.meta.env.VITE_IMAGE_BASE_URL}/${form.eventImage.replace(/\\/g, "/")}`
                            : URL.createObjectURL(form.eventImage)
                        }
                        alt="Preview"
                        className="rounded"
                        style={{ maxHeight: "150px" }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4"
              style={{ letterSpacing: "1px" }}
            >
              Schedule & Location
            </h6>
            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formStartDate">
                  <Form.Label>
                    Registration Start Date{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    isInvalid={!!errors.startDate}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formEndDate">
                  <Form.Label>
                    Registration End Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    isInvalid={!!errors.endDate}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formEventDate">
                  <Form.Label>
                    Event Date (One-time) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    isInvalid={!!errors.eventDate}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.eventDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formCampus">
                  <Form.Label>
                    Campus <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="campus"
                    value={form.campus}
                    onChange={handleChange}
                    isInvalid={!!errors.campus}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Campus</option>
                    <option value="KCE">KCE</option>
                    <option value="KIT">KIT</option>
                    <option value="KAHE">KAHE</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.campus}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formVenue">
                  <Form.Label>
                    Venue <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="venue"
                    value={form.venue}
                    placeholder="Enter venue"
                    onChange={handleChange}
                    isInvalid={!!errors.venue}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.venue}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formMode">
                  <Form.Label>
                    Mode <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="mode"
                    value={form.mode}
                    onChange={handleChange}
                    isInvalid={!!errors.mode}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Mode</option>
                    <option>Online</option>
                    <option>Offline</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.mode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <h6
              className="text-uppercase text-secondary fw-bold small mb-3 border-bottom pb-2 mt-4"
              style={{ letterSpacing: "1px" }}
            >
              Classification & Status
            </h6>
            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formType">
                  <Form.Label>
                    Event Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    isInvalid={!!errors.type}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Type</option>
                    <option>Workshop</option>
                    <option>Competition</option>
                    <option>Hackathon</option>
                    <option>Cultural</option>
                    <option>Seminar</option>
                    <option>Others</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Form.Group controlId="formVisibility">
                  <Form.Label>
                    Visibility <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    isInvalid={!!errors.visibility}
                    className="shadow-none"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select Visibility</option>
                    <option>KCE</option>
                    <option>KIT</option>
                    <option>KAHE</option>
                    <option>All Colleges</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.visibility}
                  </Form.Control.Feedback>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Save Details"
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  },
);

export default EventsForm;
