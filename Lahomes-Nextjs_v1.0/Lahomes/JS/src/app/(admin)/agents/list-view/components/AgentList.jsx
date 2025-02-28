"use client";
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, Row } from "react-bootstrap";
import axios from "axios";

const AgentList = ({ requestData }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const router = useRouter();
  const id = localStorage.getItem("admin_unique_id");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_API + `/fetchinstructors`, {
          admin: id
        });
        const validInstructors = response.data.instructors.filter(i => i.unique_id); // Filter out invalid entries
        setInstructors(validInstructors);
        setTotalPages(5); // Adjust based on actual pagination logic
      } catch (err) {
        setError("Error fetching instructors.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (uniqueId, updateUI) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API + '/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unique_id: uniqueId }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('Error:', result.error);
        alert(`Failed to delete: ${result.error}`);
        return;
      }
      alert(result.message);
      if (typeof updateUI === 'function') updateUI(uniqueId);
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error, please try again later.');
    }
  };

  const removeInstructorFromUI = (uniqueId) => {
    setInstructors(prev => prev.filter(instructor => instructor.unique_id !== uniqueId));
  };

  const handleEdit = (instructorId) => {
    console.log("Editing ID:", instructorId);
    setEditingId(instructorId);
    const instructor = instructors.find((instructor) => instructor.unique_id === instructorId);
    console.log("Selected Instructor:", instructor);
    setEditedData({ ...instructor });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async (instructorId) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API + '/update', {
        unique_id: instructorId,
        ...editedData,
      });
      if (response.data.message === "Update successful") {
        setInstructors(prev =>
          prev.map(instructor =>
            instructor.unique_id === instructorId ? { ...instructor, ...editedData } : instructor
          )
        );
        alert("Instructor updated successfully.");
      } else {
        alert("Failed to update instructor: " + response.data.error);
      }
    } catch (error) {
      console.error('Error updating instructor:', error.response?.data || error.message);
      alert("Error updating instructor: " + (error.response?.data?.error || error.message));
    } finally {
      setEditingId(null);
      setEditedData({});
    }
  };

  const uniqueGroups = [...new Set(instructors.map((instructor) => instructor.group_name))];
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = instructor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesGroup = selectedGroup === "All" || instructor.group_name === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleGroupFilter = (group) => {
    setSelectedGroup(group);
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
                          <input
                            type="search"
                            className="form-control"
                            value={searchQuery}
                            placeholder="Search Agent"
                            autoComplete="off"
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                        </div>
                      </form>
                    </Col>
                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        {filteredInstructors.length} <span className="text-muted">Instructors</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <div className="text-md-end mt-3 mt-md-0">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-group-filter">
                        Filter by Group
                      </Dropdown.Toggle>
                      <Dropdown.Menu variant="outline-primary" id="dropdown-group-filter">
                        <Dropdown.Item onClick={() => handleGroupFilter("All")}>All</Dropdown.Item>
                        {uniqueGroups.map((group, idx) => (
                          <Dropdown.Item key={idx} onClick={() => handleGroupFilter(group)}>
                            {group}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
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
                      <th>Unique Id</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstructors.map((instructor) => (
                      <tr key={instructor.unique_id}>
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
                        <td>{instructor.unique_id}</td>
                        <td>{instructor.created_at}</td>
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
                              onClick={() => handleDelete(instructor.unique_id, removeInstructorFromUI)}
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