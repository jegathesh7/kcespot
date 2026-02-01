import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";

const AchieversForm = forwardRef(
  ({ initialData, onSave, onCancel, setIsDirty }, ref) => {
    const isEditMode = !!initialData;
    const [entryType, setEntryType] = useState("image"); // image | manual
    const [studentCount, setStudentCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
      otherCategory: "",
    });

    const PREDEFINED_CATEGORIES = [
      "Academics",
      "Placement",
      "Hackathon",
      "Sports",
    ];

    const DEPARTMENTS = [
      "IT",
      "CSE",
      "ECE",
      "EEE",
      "ETE",
      "CST",
      "CY",
      "MECH",
      "CIVIL",
      "AIDS",
      "CSBS",
      "CSD",
      "MBA",
      "MCA",
      "MCT",
    ];

    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        if (validate()) {
          setIsSubmitting(true);
          try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
              if (key === "students") {
                const studentsToSubmit = form.students.map((s) => ({
                  ...s,
                  dept: s.dept === "Others" ? s.otherDept : s.dept,
                }));
                formData.append("students", JSON.stringify(studentsToSubmit));
                // Append student images
                form.students.forEach((student, index) => {
                  if (student.imageFile) {
                    formData.append(`studentImage_${index}`, student.imageFile);
                  }
                });
              } else if (key === "posterImage") {
                if (form[key] instanceof File) {
                  formData.append("posterImage", form[key]);
                } else if (entryType === "manual") {
                  formData.append("posterImage", "null");
                }
              } else if (key === "category") {
                if (form.category === "Others") {
                  formData.append("category", form.otherCategory);
                } else {
                  formData.append("category", form.category);
                }
              } else if (key === "otherCategory") {
                // Skip
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

    useEffect(() => {
      if (initialData) {
        // ... existing initialization logic ...
        // Determine initial category state
        let initCategory = initialData.category || "";
        let initOtherCategory = "";

        if (initCategory && !PREDEFINED_CATEGORIES.includes(initCategory)) {
          initOtherCategory = initCategory;
          initCategory = "Others";
        }

        setForm({
          name: initialData.name || "",
          college: initialData.college || "",
          batch: initialData.batch || "",
          category: initCategory,
          otherCategory: initOtherCategory,
          description: initialData.description || "",
          status: initialData.status !== undefined ? initialData.status : true,
          eventDate: initialData.eventDate
            ? initialData.eventDate.split("T")[0]
            : "",
          posterImage: initialData.posterImage || "",
          students: initialData.students
            ? initialData.students.map((s) => ({
                ...s,
                dept: DEPARTMENTS.includes(s.dept) ? s.dept : "Others",
                otherDept: DEPARTMENTS.includes(s.dept) ? "" : s.dept,
              }))
            : [],
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
      const { name, value, type, checked, files } = e.target;

      // If switching away from 'Others', clear the custom input
      if (name === "category" && value !== "Others") {
        setForm({
          ...form,
          category: value,
          otherCategory: "",
        });
      } else {
        setForm({
          ...form,
          [name]:
            type === "checkbox" ? checked : type === "file" ? files[0] : value,
        });
      }
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

      if (field === "dept" && value !== "Others") {
        updated[index].otherDept = "";
      }

      // If updating imageFile, also update imageUrl for preview
      if (field === "imageFile" && value instanceof File) {
        updated[index]["imageUrl"] = URL.createObjectURL(value);
      }

      setForm({ ...form, students: updated });
      if (setIsDirty) setIsDirty(true);
    };

    const handleStudentCount = (count) => {
      setStudentCount(count);
      const oldStudents = form.students;
      const students = Array.from(
        { length: count },
        (_, i) =>
          oldStudents[i] || {
            name: "",
            year: "",
            dept: "",
            otherDept: "",
            imageUrl: "",
            imageFile: null,
          },
      );
      setForm({ ...form, students });
      if (setIsDirty) setIsDirty(true);
    };

    const validate = () => {
      const newErrors = {};
      if (!form.name.trim()) newErrors.name = "Achievement Name is required";
      if (!form.college.trim()) newErrors.college = "College Name is required";
      if (!form.category) newErrors.category = "Category is required";
      if (form.category === "Others" && !form.otherCategory.trim()) {
        newErrors.otherCategory = "Please specify the category";
      }
      if (!form.batch.trim()) newErrors.batch = "Batch is required";
      if (!form.description.trim())
        newErrors.description = "Description is required";
      if (!form.eventDate) newErrors.eventDate = "Event Date is required";

      // URL Validation Regex
      const urlPattern =
        /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

      if (entryType === "image") {
        if (!form.posterImage) {
          // Basic check: if strictly empty string and no file
          newErrors.posterImage = "Poster Image is required";
        }
      }

      if (entryType === "manual") {
        if (studentCount <= 0) {
          newErrors.studentCount = "Value should not be zero";
          newErrors.evidence = "Please add at least one student";
        } else if (studentCount > 10) {
          newErrors.studentCount = "Maximum 10 students allowed";
          newErrors.evidence = "You can add up to 10 students only";
        } else {
          // Validate students
          let hasStudentIssues = false;

          const invalidStudents = form.students.some((s) => {
            const name = s.name || "";
            const year = s.year || "";
            const dept = s.dept || "";
            const otherDept = s.otherDept || "";

            const nameInvalid = !name.trim();
            const yearInvalid = !year.trim();
            const deptInvalid =
              !dept.trim() || (dept === "Others" && !otherDept.trim());

            return nameInvalid || yearInvalid || deptInvalid;
          });

          if (invalidStudents) {
            newErrors.evidence =
              "Please fill all required student fields (Name, Year, Dept)";
            newErrors.studentErrors = true; // Flag to trigger row-level visual feedback
          }
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const submit = async (e) => {
      e.preventDefault();
      if (validate()) {
        setIsSubmitting(true);
        try {
          const formData = new FormData();
          Object.keys(form).forEach((key) => {
            if (key === "students") {
              // Stringify students array, but first we can optionally clean it or just rely on backend to update urls
              // We pass the full array. Backend will update imageUrl for those with matching files.
              const studentsToSubmit = form.students.map((s) => ({
                ...s,
                dept: s.dept === "Others" ? s.otherDept : s.dept,
              }));
              formData.append("students", JSON.stringify(studentsToSubmit));

              // Append student images
              form.students.forEach((student, index) => {
                if (student.imageFile) {
                  formData.append(`studentImage_${index}`, student.imageFile);
                }
              });
            } else if (key === "posterImage") {
              if (form[key] instanceof File) {
                formData.append("posterImage", form[key]);
              } else if (entryType === "manual") {
                formData.append("posterImage", "null");
              }
            } else if (key === "category") {
              if (form.category === "Others") {
                formData.append("category", form.otherCategory);
              } else {
                formData.append("category", form.category);
              }
            } else if (key === "otherCategory") {
              // Skip
            } else {
              formData.append(key, form[key]);
            }
          });
          await onSave(formData);
        } catch (error) {
          console.error("Error submitting form:", error);
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

                  {/* Custom Category Input */}
                  {form.category === "Others" && (
                    <div className="mt-2">
                      <Form.Control
                        type="text"
                        name="otherCategory"
                        placeholder="Enter custom category"
                        value={form.otherCategory}
                        onChange={handleChange}
                        isInvalid={!!errors.otherCategory}
                        className="shadow-none"
                        style={{ borderRadius: "6px" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.otherCategory}
                      </Form.Control.Feedback>
                    </div>
                  )}
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
                label="Poster Image"
                name="entryType"
                id="typeImage"
                value="image"
                checked={entryType === "image"}
                onChange={() => {
                  setEntryType("image");
                  setStudentCount(0);
                  setForm((prev) => ({ ...prev, students: [] }));
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
                  setForm((prev) => ({ ...prev, posterImage: "" }));
                  setIsDirty && setIsDirty(true);
                }}
                className="fw-medium small text-muted"
              />
            </div>

            <Row className="mb-4">
              <Col md={12}>
                {entryType === "image" && (
                  <Form.Group controlId="formPosterImage">
                    <Form.Label>
                      Poster Image <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="posterImage"
                      onChange={handleChange}
                      accept="image/*"
                      isInvalid={!!errors.posterImage}
                      className="shadow-none"
                      style={{ borderRadius: "6px" }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.posterImage}
                    </Form.Control.Feedback>

                    {/* Preview Logic */}
                    {form.posterImage && (
                      <div className="mt-3 p-2 border rounded bg-light d-inline-block">
                        <img
                          src={
                            typeof form.posterImage === "string"
                              ? form.posterImage.startsWith("http")
                                ? form.posterImage
                                : `${import.meta.env.VITE_IMAGE_BASE_URL}/${form.posterImage.replace(/\\/g, "/")}`
                              : URL.createObjectURL(form.posterImage)
                          }
                          alt="Preview"
                          className="rounded"
                          style={{ maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                )}

                {entryType === "manual" && (
                  <div>
                    <Form.Group controlId="formStudentCount" className="mb-3">
                      <Form.Label>Number of Students (Max:10)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="10"
                        value={studentCount.toString()}
                        onChange={(e) => {
                          let val = parseInt(e.target.value, 10);
                          if (isNaN(val)) val = 0;
                          if (val > 10) val = 10;
                          handleStudentCount(val);
                        }}
                        placeholder="e.g. 5"
                        isInvalid={!!errors.studentCount}
                        className="shadow-none"
                        style={{ maxWidth: "150px", borderRadius: "6px" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.studentCount}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {form.students.length > 0 && (
                      <div className="card border shadow-sm">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th
                                  className="ps-4 py-3 text-secondary text-uppercase small fw-bold"
                                  style={{ width: "5%" }}
                                >
                                  #
                                </th>
                                <th
                                  className="py-3 text-secondary text-uppercase small fw-bold"
                                  style={{ width: "25%" }}
                                >
                                  Name <span className="text-danger">*</span>
                                </th>
                                <th
                                  className="py-3 text-secondary text-uppercase small fw-bold"
                                  style={{ width: "15%" }}
                                >
                                  Year <span className="text-danger">*</span>
                                </th>
                                <th
                                  className="py-3 text-secondary text-uppercase small fw-bold"
                                  style={{ width: "20%" }}
                                >
                                  Dept <span className="text-danger">*</span>
                                </th>
                                <th
                                  className="py-3 text-secondary text-uppercase small fw-bold"
                                  style={{ width: "35%" }}
                                >
                                  Photo URL
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {form.students.map((student, index) => (
                                <tr key={index}>
                                  <td className="ps-4 fw-bold text-muted">
                                    {index + 1}
                                  </td>
                                  <td className="p-2">
                                    <Form.Control
                                      size="sm"
                                      placeholder="Student Name"
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
                                        !(student.name || "").trim()
                                      }
                                    />
                                  </td>
                                  <td className="p-2">
                                    <Form.Select
                                      size="sm"
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
                                        !(student.year || "").trim()
                                      }
                                    >
                                      <option value="">Select Year</option>
                                      <option value="I">I</option>
                                      <option value="II">II</option>
                                      <option value="III">III</option>
                                      <option value="IV">IV</option>
                                    </Form.Select>
                                  </td>
                                  <td className="p-2">
                                    <Form.Select
                                      size="sm"
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
                                        !(student.dept || "").trim()
                                      }
                                      className="mb-1"
                                    >
                                      <option value="">Select Dept</option>
                                      {DEPARTMENTS.map((d) => (
                                        <option key={d} value={d}>
                                          {d}
                                        </option>
                                      ))}
                                      <option value="Others">Others</option>
                                    </Form.Select>
                                    {student.dept === "Others" && (
                                      <Form.Control
                                        type="text"
                                        size="sm"
                                        placeholder="Specify Dept"
                                        value={student.otherDept}
                                        onChange={(e) =>
                                          handleStudentChange(
                                            index,
                                            "otherDept",
                                            e.target.value,
                                          )
                                        }
                                        isInvalid={
                                          errors.studentErrors &&
                                          !student.otherDept?.trim()
                                        }
                                      />
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <div className="d-flex align-items-center gap-2">
                                      {student.imageUrl && (
                                        <img
                                          src={
                                            student.imageUrl.startsWith(
                                              "blob:",
                                            ) ||
                                            student.imageUrl.startsWith("http")
                                              ? student.imageUrl
                                              : `${import.meta.env.VITE_IMAGE_BASE_URL}/${student.imageUrl.replace(/\\/g, "/")}`
                                          }
                                          alt="Preview"
                                          className="rounded-circle object-fit-cover"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        />
                                      )}
                                      <Form.Control
                                        type="file"
                                        size="sm"
                                        accept="image/*"
                                        onChange={(e) =>
                                          handleStudentChange(
                                            index,
                                            "imageFile",
                                            e.target.files[0],
                                          )
                                        }
                                        className="shadow-none border-secondary-subtle"
                                        style={{ fontSize: "0.8rem" }}
                                      />
                                    </div>
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
                  "Save Changes"
                ) : (
                  "Create Record"
                )}
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
