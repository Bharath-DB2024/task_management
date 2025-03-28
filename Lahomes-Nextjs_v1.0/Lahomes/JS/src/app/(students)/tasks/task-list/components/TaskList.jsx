"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "react-bootstrap";
import axios from "axios";



const TaskList = () => {

  const [task, settask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");


  useEffect(() => {
    const fetchTasks = async () => {
      const studentId = localStorage.getItem("student_unique_id");

      if (!studentId) {
        setError("student ID not found in local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/getAllTask/${studentId}`);

        if (response.data.task === "No tasks found") {
          settask([]);
        } else {
          settask(response.data);
        }
        setTotalPages(Math.ceil(response.data.length / 8));
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentPage]);


  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  const filteredtask = task.filter((t) => {
    const matchesSearch = t.task_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesGroup = selectedGroup === "All" || t.groupName === selectedGroup;
    return matchesSearch && matchesGroup;
  });

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
  if (task.length === 0) return <h2 className="text-primary text-center">No Task for this student</h2>;



  return (
    <>
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
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
              <CardTitle className='text-info' as={"h4"}>All Task List</CardTitle>
            </CardHeader>

            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th className="fw-bold">Check</th>
                      <th className="fw-bold">Task_Name</th>
                      <th className="fw-bold">Status</th>
                      <th className="fw-bold">Created_at</th>
                      <th className="fw-bold">Expiry_Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredtask.map((task) => (
                      <tr key={task.task_id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input" style={{ cursor: 'pointer' }}
                          />
                        </td>
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