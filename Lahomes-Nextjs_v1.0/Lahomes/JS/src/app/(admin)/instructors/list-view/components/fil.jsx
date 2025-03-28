"use client";
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";
import axios from "axios";



const AgentList = ({ requestData }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // Track which instructor is being edited
  const [editedData, setEditedData] = useState({}); // Store edited data
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get(`https://twpwlfdg-5000.inc1.devtunnels.ms/instructors?page=${currentPage}`);
        setInstructors(response.data);
        setTotalPages(5); // Assuming API returns total pages
      } catch (err) {
        setError("Error fetching instructors.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [currentPage]); // Refetch when page changes
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


  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewInstructor = (instructorId) => {
    router.push(`/instructor/${instructorId}`); // Navigate to new page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
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

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
    <>
          <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="border-0">
              <Row className="justify-content-between">
                <Col lg={6}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <form className="app-search d-none d-md-block me-auto">
                        <div className="position-relative">
                          <input type="search" className="form-control"   value={searchQuery}  placeholder="Search Agent" autoComplete="off"  onChange={(e) => setSearchQuery(e.target.value)} />
                          <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                        </div>
                      </form>
                    </Col>
                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        311 <span className="text-muted"> Agent</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <div className="text-md-end mt-3 mt-md-0">
                    <button type="button" className="btn btn-outline-primary me-2">
                      <IconifyIcon icon="ri:settings-2-line" className="me-1" />
                      More Setting
                    </button>
                    <button type="button" className="btn btn-outline-primary me-2">
                      <IconifyIcon icon="ri:filter-line" className="me-1" /> Filters
                    </button>
                    <button type="button" className="btn btn-success me-1">
                      <IconifyIcon icon="ri:add-line" /> New Agent
                    </button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>
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
                {filteredInstructors.map((instructor, idx) => (
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
          <CardFooter>
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handlePrevPage}>Previous</button>
                </li>
                <li className="page-item active">
                  <span className="page-link">{currentPage}</span>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={handleNextPage}>Next</button>
                </li>
              </ul>
            </nav>
          </CardFooter>
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default AgentList;