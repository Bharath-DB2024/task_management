"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "react-bootstrap";

const Transaction = ({ requestData }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track which instructor is being edited
  const [editedData, setEditedData] = useState({}); // Store edited data

  useEffect(() => {
    // Fetch instructors data from backend
    const fetchInstructors = async () => {
      try {
        const response = await axios.get("https://twpwlfdg-5000.inc1.devtunnels.ms/instructors");
        setInstructors(response.data);
      } catch (err) {
        setError("Error fetching instructors.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Function to handle deletion
  const handleDelete = async (instructorId) => {
    try {
      await axios.delete(`https://twpwlfdg-5000.inc1.devtunnels.ms/instructors/${instructorId}`);
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorId));
      alert("Instructor deleted successfully.");
    } catch (err) {
      alert("Error deleting instructor.");
    }
  };

  // Function to handle edit button click
  const handleEdit = (instructorId) => {
    setEditingId(instructorId); // Set the instructor being edited
    const instructor = instructors.find((instructor) => instructor.unique_id === instructorId);
    setEditedData({ ...instructor }); // Initialize edited data with the current instructor data
  };

  // Function to handle input changes
  const handleInputChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value, // Update the edited data
    });
  };

  // Function to save changes
  const handleSave = async (instructorId) => {
    try {
      await axios.put(`https://twpwlfdg-5000.inc1.devtunnels.ms/instructors/${instructorId}`, editedData);
      setInstructors(
        instructors.map((instructor) =>
          instructor.unique_id === instructorId ? { ...instructor, ...editedData } : instructor
        )
      );
      setEditingId(null); // Exit edit mode
      alert("Instructor updated successfully.");
    } catch (err) {
      alert("Error updating instructor.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <CardTitle as={"h4"}>All Instructors List</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-responsive">
              <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Group</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor, idx) => (
                    <tr key={idx}>
                      <td>
                        {editingId === instructor.unique_id ? (
                          <input
                            type="text"
                            value={editedData.name || ""}
                            onChange={(e) => handleInputChange(e, "name")}
                            className="form-control"
                          />
                        ) : (
                          instructor.name
                        )}
                      </td>
                      <td>
                        {editingId === instructor.unique_id ? (
                          <input
                            type="text"
                            value={editedData.email || ""}
                            onChange={(e) => handleInputChange(e, "email")}
                            className="form-control"
                          />
                        ) : (
                          instructor.email
                        )}
                      </td>
                      <td>
                        {editingId === instructor.unique_id ? (
                          <input
                            type="text"
                            value={editedData.password || ""}
                            onChange={(e) => handleInputChange(e, "password")}
                            className="form-control"
                          />
                        ) : (
                          instructor.password
                        )}
                      </td>
                      <td>
                        {editingId === instructor.unique_id ? (
                          <input
                            type="text"
                            value={editedData.group_name || ""}
                            onChange={(e) => handleInputChange(e, "group_name")}
                            className="form-control"
                          />
                        ) : (
                          instructor.group_name
                        )}
                      </td>
                      <td>{new Date(instructor.created_at).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            instructor.status === "Active" ? "success" : "danger"
                          }-subtle text-${instructor.status === "Active" ? "success" : "danger"} py-1 px-2 fs-13`}
                        >
                          {instructor.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="light" size="sm">
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                          </Button>
                          {editingId === instructor.unique_id ? (
                            <Button
                              variant="soft-success"
                              size="sm"
                              onClick={() => handleSave(instructor.unique_id)}
                            >
                              <IconifyIcon icon="solar:check-circle-broken" className="align-middle fs-18" />
                            </Button>
                          ) : (
                            <Button
                              variant="soft-primary"
                              size="sm"
                              onClick={() => handleEdit(instructor.unique_id)}
                            >
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </Button>
                          )}
                          <Button
                            variant="soft-danger"
                            size="sm"
                            onClick={() => handleDelete(instructor.unique_id)}
                          >
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};


export default Transaction;