"use client";

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row, Modal } from "react-bootstrap";
import axios from "axios";

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [successId, setSuccessId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");


  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const buttonsDisabled = isEditing || isModalOpen;

  const router = useRouter();
  const id = localStorage.getItem("admin_unique_id");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/fetchinstructors`, {
          admin: id
        });
        const validInstructors = response.data.instructors.filter(i => i.unique_id);
        setInstructors(validInstructors);
        setTotalPages(Math.ceil(response.data.length / 8));
      } catch (err) {
        setError("Error fetching instructors.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, [currentPage]);

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

  if (instructors.length === 0) return <h2 className="text-primary text-center">No Instructor for this Admin</h2>;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (instructorId) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API + `/delete`, {
        unique_id: instructorId
      });

      setInstructors(instructors.filter(instructor => instructor.unique_id !== instructorId));
      showAlertModal("Success", "Instructor Deleted Successfully");
    } catch (err) {
      showAlertModal("Error", "Error deleting instructor.");
    }
  };

  const handleEdit = (instructorId) => {
    setEditingId(instructorId);
    setSuccessId(null);
    const instructorToEdit = instructors.find((ins) => ins.unique_id === instructorId);
    setEditedData({ ...instructorToEdit });
  };

  const handleSave = async (instructorId) => {
    try {
      const response = await axios.post(`http://localhost:5000/update`, {
        unique_id: instructorId,
        ...editedData,
      });

      if (response.data.message === 'Update successful') {
        setInstructors((prev) =>
          prev.map((instructor) =>
            instructor.unique_id === instructorId ? { ...instructor, ...editedData } : instructor
          )
        );
        showAlertModal("Success", "Instructor Updated Successfully!");
        setSuccessId(instructorId);
        setTimeout(() => setSuccessId(null), 1000);
      } else {
        showAlertModal("Error", `Failed to update instructor: ${response.data.error}`);
      }
    } catch (error) {
      showAlertModal("Error", `Error updating instructor: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsEditing(false);
      setEditingId(null);
      setEditedData({});
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setEditedData({});
  };


  const handleChart = (instructorId) => {
    router.push(`/instructors/instchart?instructor_id=${instructorId}`);
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch = instructor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesGroup = selectedGroup === "All" || instructor.group_name === selectedGroup;
    return matchesSearch && matchesGroup;
  });


  const sortedInstructors = [...filteredInstructors].sort((a, b) => {
    const dateA = a.created_at.split("-").reverse().join("-");
    const dateB = b.created_at.split("-").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const instructorsPerPage = 8;
  const indexOfLastTask = currentPage * instructorsPerPage;
  const indexOfFirstTask = indexOfLastTask - instructorsPerPage;
  const currentInstructors = sortedInstructors.slice(indexOfFirstTask, indexOfLastTask);

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
                            placeholder="Search Instructor"
                            autoComplete="off"
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                        </div>
                      </form>
                    </Col>
                  </Row>
                </Col>

                <Col lg={6}>
                  <div className="d-flex justify-content-end gap-2 mt-3 mt-md-0">
                    <h5 className="text-primary fw-bold mb-0 fs-17">
                      {currentInstructors.length} <span>Instructors</span>
                    </h5>
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
              <CardTitle className='text-info' as={"h4"}>All Instructors List</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th className="fw-bold">Name</th>
                      <th className="fw-bold">Email</th>
                      <th className="fw-bold">Password</th>
                      <th className="fw-bold">Created_at</th>
                      <th className="fw-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInstructors.map((instructor) => (
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
                        <td>{instructor.created_at}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleChart(instructor.unique_id)}
                              disabled={buttonsDisabled}
                            >
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Button>

                            {editingId === instructor.unique_id ? (
                              <>
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleSave(instructor.unique_id)}
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
                                onClick={() => handleEdit(instructor.unique_id)}
                                disabled={buttonsDisabled}
                              >
                                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                              </Button>
                            )}

                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleDelete(instructor.unique_id)}
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


export default InstructorList;