// 'use client';

// import PageTitle from '@/components/PageTitle';
// import IconifyIcon from '@/components/wrappers/IconifyIcon';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";

// const CustomersListPage = () => {
//   const [studentData, setStudentData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.post("https://twpwlfdg-5000.inc1.devtunnels.ms/fecth", {
//           admin_unique_id: "9upl3q"
//         });
//      console.log(response.data);
     
//         if (!response.data || !response.data.instructors || !response.data.students) {
//           throw new Error("Invalid response format");
//         }
  
//         const { instructors, students } = response.data;
  
//         // Create a mapping of instructors by their unique ID
//         const instructorMap = instructors.reduce((acc, student) => {
//           acc[student.students_unique_id] = student.instructor_name;
//           return acc;
//         }, {});
  
//         // Map students to include student name
//         const enrichedStudents = students.map(student => ({
//           ...student,
//           instructor_name: instructorMap[student.students_unique_id] || "Unknown",
//         }));
  
//         setStudentData(enrichedStudents);
//       } catch (err) {
//         console.error("Error fetching student data:", err);
//         setError("Error fetching student data.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchStudents();
//   }, []);
  

//   const handleDelete = async (studentId) => {

//     try {
//       await axios.delete(`https://twpwlfdg-5000.inc1.devtunnels.ms/students/${studentId}`);
//       // Remove the deleted student from the state
//       setStudentData(studentData.filter(student => student.student_unique_id !== studentId));
//       alert("Student deleted successfully.");
//     } catch (err) {
//       alert("Error deleting student.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <>
//       <Row>
//         <Col xl={12}>
//           <Card>
//             <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
//               <CardTitle as={'h4'}>Student List</CardTitle>
//             </CardHeader>
//             <CardBody className="p-0">
//               <div className="table-responsive">
//                 <table className="table align-middle text-nowrap table-hover table-centered mb-0">
//                   <thead className="bg-light-subtle">
//                     <tr>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Group</th>
//                       <th>Password</th>
//                       <th>Instructor</th>
//                       <th>Instructor Group</th>
//                       <th>Created At</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {studentData.map((student, idx) => (
//                       <tr key={idx}>
//                         <td>
//                           <Link href="" className="text-dark fw-medium fs-15">
//                             {student.student_name}
//                           </Link>
//                         </td>
//                         <td>{student.student_email}</td>
//                         <td>{student.group_name}</td>
//                         <td>{student.password}</td>
//                         <td>{student.instructor_name}</td>
//                         <td>{student.instructor_name}</td>
//                         <td>{new Date(student.created_at).toLocaleDateString()}</td>
//                         <td>
//                           <div className="d-flex gap-2">
//                             <Button variant="light" size="sm">
//                               <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
//                             </Button>
//                             <Button variant="soft-primary" size="sm">
//                               <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
//                             </Button>
//                             <Button variant="soft-danger" size="sm" onClick={() => handleDelete(student.student_unique_id)}>
//                               <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default CustomersListPage;

"use client";
import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, Row } from "react-bootstrap";
import axios from "axios";

const CustomersListPage = ({ requestData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [students, setStudentData] = useState([]);
  const router = useRouter();
  const id=localStorage.getItem("admin_unique_id")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_API+"/fecth", {
          admin: id
        });
        console.log(response.data);

        if (!response.data || !response.data.instructors || !response.data.students) {
          throw new Error("Invalid response format");
        }

        const { instructors, students } = response.data;

        // Create a mapping of instructors by their unique ID
        const instructorMap = instructors.reduce((acc, student) => {
          acc[student.unique_id] = student.instructor_name;
          return acc;
        }, {});
  console.log(instructorMap);
  
        // Map students to include student name
        const enrichedStudents = students.map(student => ({
          ...student,
          instructor_name: instructorMap[student.unique_id] || "Unknown",
        }));

        setStudentData(enrichedStudents);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Error fetching student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    console.log("studentID",studentId);
    
    try {
      await axios.post(process.env.NEXT_PUBLIC_API+`/delete`,{
        unique_id:studentId
      });
      // Remove the deleted student from the state
      setStudentData(students.filter(student => student.unique_id !== studentId));
      alert("Student deleted successfully.");
    } catch (err) {
      alert("Error deleting student.");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewStudent = (studentId) => {
    router.push(`/student/${studentId}`);
  };

  const handleEdit = (StudentId) => {
    
    setEditingId(StudentId);
    const student = students.find((student) => student.unique_id === StudentId);
    setEditedData({ ...student });
  };

  const handleInputChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const uniqueGroups = [...new Set(students.map((student) => student.group_name))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
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
                        {filteredStudents.length} <span className="text-muted">Students</span>
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
              <CardTitle as={"h4"}>All Students List</CardTitle>
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
                    {filteredStudents.map((student, idx) => (
                      <tr key={idx}>
                        <td>
                          {editingId === student.unique_id ? (
                            <input
                              type="text"
                              value={editedData.name || ""}
                              onChange={(e) => handleInputChange(e, "student_name")}
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
                              onChange={(e) => handleInputChange(e, "student_email")}
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
                        <td>
                          {
                            student.unique_id
                          }
                        </td>
                        <td>{student.created_at}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              student.status === "Active" ? "success" : "danger"
                            }-subtle text-${student.status === "Active" ? "success" : "danger"} py-1 px-2 fs-13`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="light" size="sm">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Button>
                            {editingId === student.unique_id ?(
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
                              onClick={() => handleDelete(student.unique_id)}
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

export default CustomersListPage;