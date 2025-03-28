"use client";

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, Row } from "react-bootstrap";
import axios from "axios";



const StudentsList = () => {

  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const router = useRouter();
  const id = localStorage.getItem("instructor_unique_id");

  useEffect(() => {
    const fetchstudents = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/fetchStudents`, {
          instructor: id
        });
        const validstudents = response.data.students.filter(i => i.unique_id); 
        setstudents(validstudents);
        setTotalPages(50); 
      } catch (err) {
        setError("Error fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchstudents();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API+`/delete`,{
        unique_id:studentId
      });
   
       setstudents(students.filter(student=>student.unique_id !== studentId));
      alert("student Deleted ");
    } catch (err) {
      alert("Error deleting Student.");
    }
  };

  const removeStudent = (uniqueId) => {
    setstudents(prev => prev.filter(student => student.unique_id !== uniqueId));
  };

  const handleEdit = (studentId) => {
    setEditingId(studentId);
    const student = students.find((student) => student.unique_id === studentId);
    setEditedData({ ...student });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async (studentId) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API + '/update', {
        unique_id: studentId,
        ...editedData,
      });
      if (response.data.message === "Update successful") {
        setstudents(prev =>
          prev.map(student =>
            student.unique_id === studentId ? { ...student, ...editedData } : student
          )
        );
        alert("Student updated");
      } else {
        alert("Failed to update student: " + response.data.error);
      }
    } catch (error) {
      console.error('Error updating student:', error.response?.data || error.message);
      alert("Error updating student: " + (error.response?.data?.error || error.message));
    } finally {
      setEditingId(null);
      setEditedData({});
    }
  };


  const handleChart = (studentId) => {
    localStorage.removeItem('student_id'); 
    localStorage.setItem('student_id',studentId); 
    router.push(`/student/studentChart`);
  };
  
  const uniqueGroups = [...new Set(students.map((student) => student.group_name))];
  const filteredstudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesGroup = selectedGroup === "All" || student.group_name === selectedGroup;
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
        <Row className="justify-content-between align-items-center">
       
          <Col lg={6}>
            <Row className="align-items-center">
              <Col lg={6}>
                <form className="app-search d-none d-md-block me-auto">
                  <div className="position-relative">
                    <input
                      type="search"
                      className="form-control"
                      value={searchQuery}
                      placeholder="Search Student"
                      autoComplete="off"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                  </div>
                </form>
              </Col>
              <Col lg={4}>
                <h5 className="text-dark fw-medium mb-0">
                  {filteredstudents.length} <span className="text-muted">students</span>
                </h5>
              </Col>
            </Row>
          </Col>

          <Col lg={6}>
            <div className="d-flex justify-content-end gap-2 mt-3 mt-md-0">
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-group-filter">
                  Filter by Group
                </Dropdown.Toggle>
                <Dropdown.Menu>
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
              <CardTitle as={"h4"}>All students List</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Email</th>
                      <th className="fw-bold">Password</th>
                      <th className="fw-bold">Group</th>
                      <th className="fw-bold">Unique Id</th>
                      <th className="fw-bold">Date</th>
                      <th className="fw-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredstudents.map((student) => (
                      <tr key={student.unique_id}>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.name || ""}
                              onChange={(e) => handleInputChange(e, "name")}
                              className="form-control"
                            />
                          ) : (
                            student.name
                          )}
                        </td>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.email || ""}
                              onChange={(e) => handleInputChange(e, "email")}
                              className="form-control"
                            />
                          ) : (
                            student.email
                          )}
                        </td>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.password || ""}
                              onChange={(e) => handleInputChange(e, "password")}
                              className="form-control"
                            />
                          ) : (
                           student.password
                          )}
                        </td>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.group_name || ""}
                              onChange={(e) => handleInputChange(e, "group_name")}
                              className="form-control"
                            />
                          ) : (
                            student.group_name
                          )}
                        </td>
                        <td>{student.unique_id}</td>
                        <td>{student.created_at}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="light" size="sm">
                            
                            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18"onClick={() => handleChart(student.unique_id)}/>
                            </Button>
                            {editingId === student.unique_id ? (
                              <Button
                                variant="soft-success"
                                size="sm"
                                onClick={() => handleSave(student.unique_id)}
                              >
                                <IconifyIcon icon="solar:check-circle-broken" className="align-middle fs-18" />
                              </Button>
                            ) : (
                              <Button
                                variant="soft-primary"
                                size="sm"
                                onClick={() => handleEdit(student.unique_id)}
                              >
                                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                              </Button>
                            )}
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => handleDelete(student.unique_id, removeStudent)}
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


export default StudentsList;