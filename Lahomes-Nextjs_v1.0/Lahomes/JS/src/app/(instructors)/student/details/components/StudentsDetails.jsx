"use client";

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Modal } from "react-bootstrap";
import axios from "axios";



const StudentsDetails = () => {

  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [successId, setSuccessId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const buttonsDisabled = isEditing || isModalOpen;
  const id = localStorage.getItem("instructor_unique_id");


  useEffect(() => {
    const fetchstudents = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/fetchStudents`, {
          instructor: id
        });
        const validstudents = response.data.students.filter(i => i.unique_id);
        setstudents(validstudents);
        setTotalPages(Math.ceil(response.data.length / 8));
      } catch (err) {
        setError("Error fetching students.");
      } finally {
        setLoading(false);
      }
    };
    fetchstudents();
  }, [currentPage]);

  if (students.length === 0) return <h2 className="text-primary text-center">No Students for this Instructor</h2>;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const showAlertModal = (title, message) => {
    setIsModalOpen(true);
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsModalOpen(false);
  };


  const handleDelete = async (studentId) => {
    try {
      await axios.post('http://localhost:5000/delete', {
        unique_id: studentId
      });

      setstudents(students.filter(student => student.unique_id !== studentId));
      showAlertModal("Success", "Student Deleted Successfully");
    } catch (err) {
      showAlertModal("Error", "Error deleting student.");
    }
  };

  const removeStudent = (uniqueId) => {
    setstudents(prev => prev.filter(student => student.unique_id !== uniqueId));
  };

  const handleEdit = (studentId) => {
    setEditingId(studentId);
    setSuccessId(null);
    const student = students.find((student) => student.unique_id === studentId);
    setEditedData({ ...student });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async (studentId) => {
    try {
      const response = await axios.post('http://localhost:5000/update', {
        unique_id: studentId,
        ...editedData,
      });
      if (response.data.message === "Update successful") {
        setstudents(prev =>
          prev.map(student =>
            student.unique_id === studentId ? { ...student, ...editedData } : student
          )
        );
        showAlertModal("Success", "Student Updated Successfully!");
        setSuccessId(studentId);
        setTimeout(() => setSuccessId(null), 1000);
      } else {
        showAlertModal("Error", `Failed to update instructor: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error updating student:', error.response?.data || error.message);
      showAlertModal("Error", `Error updating instructor: ${error.response?.data?.error || error.message}`);
    } finally {
      setEditingId(null);
      setEditedData({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setEditedData({});
  };


  const filteredstudents = students.filter((student) => {
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return matchesSearch;
  });


  const sortedStudents = [...filteredstudents].sort((a, b) => {
    const dateA = a.created_at.split("-").reverse().join("-");
    const dateB = b.created_at.split("-").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const studentsPerPage = 8;
  const indexOfLastTask = currentPage * studentsPerPage;
  const indexOfFirstTask = indexOfLastTask - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstTask, indexOfLastTask);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;



  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
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
                      <h5 className="text-primary fw-bold mb-0 fs-17">
                        {currentStudents.length} <span>Students</span>
                      </h5>
                    </Col>
                  </Row>
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
              <CardTitle className='text-info' as={"h4"}>All Students List</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Reg_Id</th>
                      <th className="fw-bold">Address</th>
                      <th className="fw-bold">Rank</th>
                      <th className="fw-bold">Date</th>
                      <th className="fw-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((student) => (
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
                              value={editedData.reg_id || ""}
                              onChange={(e) => handleInputChange(e, "reg_id")}
                              className="form-control"
                            />
                          ) : (
                            student.reg_id
                          )}
                        </td>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.address || ""}
                              onChange={(e) => handleInputChange(e, "address")}
                              className="form-control"
                            />
                          ) : (
                            student.address
                          )}
                        </td>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.student_rank || ""}
                              onChange={(e) => handleInputChange(e, "student_rank")}
                              className="form-control"
                            />
                          ) : (
                            student.student_rank
                          )}
                        </td>

                        <td>{student.created_at}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {editingId === student.unique_id ? (
                              <>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleSave(student.unique_id)}
                                  className="text-success"
                                >
                                  <IconifyIcon icon="solar:check-circle-broken" className="align-middle fs-18" />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={handleCancel}
                                  className="text-danger"
                                >
                                  <IconifyIcon icon="solar:close-circle-broken" className="align-middle fs-18" />
                                </Button>
                              </>

                            ) : (
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() => handleEdit(student.unique_id)}
                                disabled={buttonsDisabled}
                              >
                                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                              </Button>
                            )}

                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleDelete(student.unique_id)}
                              disabled={buttonsDisabled}
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


export default StudentsDetails;