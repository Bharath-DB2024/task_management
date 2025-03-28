"use client";

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, Row, Modal } from "react-bootstrap";
import axios from "axios";



const TaskList = () => {
  const router = useRouter();
  const [task, settask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showAlertModal = (title, message, variant = "success") => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const instructorId = localStorage.getItem("instructor_unique_id");

      if (!instructorId) {
        setError("Instructor ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/getAllTask/${instructorId}`);
        if (response.data.task === "No tasks found") {
          settask([]);
        } else {
          settask(response.data);
          setTotalPages(Math.ceil(response.data.length / 8));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.post(`http://localhost:5000/delete`, {
        task_id: taskId
      });

      settask(task.filter((t) => t.task_id !== taskId));
      showAlertModal("Success", "Task Deleted Successfully");
    } catch (err) {
      console.error('Error deleting task:', err.response?.data || err.message);
      showAlertModal("Error", err.response?.data.error || 'Error deleting task', "danger");
    }
  };

  const handleEdit = (taskId) => {
    setEditingId(taskId);
    const taskToEdit = task.find((t) => t.task_id === taskId);

    if (taskToEdit) {
      setEditedData({ ...taskToEdit });
    } else {
      showAlertModal("Error", "Task not found in the list!", "danger");
    }
  };

  const handleInputChange = (e, field) => {
    setEditedData((prevData) => {
      const updatedData = { ...prevData, [field]: e.target.value };
      return updatedData;
    });
  };

  const handleSave = async (taskId) => {
    try {
      const response = await axios.post(`http://localhost:5000/updateTask`, {
        task_id: taskId,
        ...editedData,
      });

      if (response.data.message === "Task updated successfully") {
        settask((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? { ...task, ...editedData } : task
          )
        );
        showAlertModal("Success", "Task Updated Successfully");
      } else {
        showAlertModal("Error", "Failed to update Task: " + response.data.error, "danger");
      }
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      showAlertModal("Error", "Error updating task: " + (error.response?.data?.error || error.message), "danger");
    } finally {
      setEditingId(null);
      setEditedData({});
    }
  };

  const handleView = async (selectedItem) => {
    router.push(`/task/custom?selectedItem=${selectedItem}`);
  };

  const uniqueGroups = [...new Set(task.map((t) => t.groupName))];
  const filteredtask = task.filter((t) => {
    const matchesSearch = t.task_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesGroup = selectedGroup === "All" || t.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleGroupFilter = (group) => {
    setSelectedGroup(group);
  };

  const sortedTasks = [...filteredtask].sort((a, b) => {
    const dateA = a.created_at.split("-").reverse().join("-");
    const dateB = b.created_at.split("-").reverse().join("-");
    return new Date(dateA) - new Date(dateB);
  });

  const tasksPerPage = 8;
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (task.length === 0) return <h2 className="text-primary text-center">No Task for this Instructor</h2>;

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body >{modalMessage}</Modal.Body>
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
                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        {currentTasks.length} <span className="text-muted">Task</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>

                <Col lg={6}>
                  <div className="d-flex justify-content-end gap-2 mt-3 mt-md-0">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-group-filter" disabled={!!editingId}>
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
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-view">
                        Custom View
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {["Shutter View", "God View", "Fly View"].map((group, idx) => (
                          <Dropdown.Item key={idx} onClick={() => handleView(group)}>
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
              <CardTitle className='text-info'as={"h4"}>All Task List</CardTitle>
            </CardHeader>

            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th className="fw-bold">Task_Name</th>
                      <th className="fw-bold">Task_Id</th>
                      <th className="fw-bold">Group_Name</th>
                      <th className="fw-bold">Status</th>
                      <th className="fw-bold">Created_Date</th>
                      <th className="fw-bold">Expiry_Date</th>
                      <th className="fw-bold">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTasks.map((task) => (
                      <tr key={task.task_id}>
                        <td>
                          {editingId === task.task_id ? (
                            <input
                              type="text"
                              value={editedData.task_name || ""}
                              onChange={(e) => handleInputChange(e, "task_name")}
                              className="form-control"
                            />
                          ) : (
                            task.task_name
                          )}
                        </td>
                        <td>{task.task_id}</td>
                        <td>
                          {editingId === task.task_id ? (
                            <input
                              type="text"
                              value={editedData.groupName || ""}
                              onChange={(e) => handleInputChange(e, "groupName")}
                              className="form-control"
                            />
                          ) : (
                            task.groupName
                          )}
                        </td>

                        <td>
                          <span
                            className={`badge bg-${task.is_completed ? "success" : "danger"}-subtle text-${task.is_completed ? "success" : "danger"} py-1 px-2 fs-13`}
                          >
                            {task.is_completed ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td>{task.created_at || 'NA'}</td>
                        <td>
                          {editingId === task.task_id ? (
                            <input
                              type="text"
                              value={editedData.expiry_date || ""}
                              onChange={(e) => handleInputChange(e, "expiry_date")}
                              className="form-control"
                            />
                          ) : (
                            task.expiry_date || 'NA'
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {editingId === task.task_id ? (
                              <>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="text-success"
                                  onClick={() => handleSave(task.task_id)}
                                >
                                  <IconifyIcon icon="solar:check-circle-broken" className="align-middle fs-18" />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="text-danger"
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditedData({});
                                  }}
                                >
                                  <IconifyIcon icon="solar:close-circle-broken" className="align-middle fs-18" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="light"
                                size="sm"
                                onClick={() => handleEdit(task.task_id)}
                                disabled={!!editingId}
                              >
                                <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                              </Button>
                            )}
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleDelete(task.task_id)}
                              disabled={!!editingId}
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




export default TaskList;