'use client';


import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Card, CardBody, Row, Col, Button, Alert, Modal} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TextFormInput from '@/components/from/TextFormInput';


const AddInstructor = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const id = localStorage.getItem("admin_unique_id");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messageSchema = yup.object({
    name: yup.string().required("Please enter name"),
    email: yup.string().email().required("Please enter email"),
    password: yup.string().required("Please enter password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm password"),
    // group_name: yup.string().required("Please enter group name"),
    // role: yup.string().required("Please enter role"),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(messageSchema),
  });

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

  const onSubmit = async (data) => {
    showAlertModal("Success", "Instructor Registered");
    setMessage(null);
    setError(null);
    
    const requestData = {
      ...data,
      admin: id,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + "/register",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
     
      reset();
    } catch (err) {
      console.error("Error:", err);
      showAlertModal("Error", "Error deleting instructor.",err.response?.data?.error || 'Something went wrong');
      
    }
  };


  const PasswordInput = ({ control, name, placeholder, label }) => {
    const [showPassword, setShowPassword] = useState(false);
  
    return (

      <div className="mb-3">
        <label className="form-label">{label}</label>
        <div className="position-relative">
          <TextFormInput
            control={control}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
          />
          <span
            className="position-absolute"
            style={{
              top: "50%",
              right: "12px", 
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 10,
              fontSize: "1.2rem",
              color: "gray",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>
      
    );
  };
  

  return (

    <form onSubmit={handleSubmit(onSubmit)}>

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

      <Card>
        <CardBody style={{ width: "100%" }}>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="name"
                  placeholder="Full Name"
                  label="Name"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="email"
                  placeholder="Enter Email"
                  label="Email"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <PasswordInput
                  control={control}
                  name="password"
                  placeholder="Enter Password"
                  label="Enter Password"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <PasswordInput
                  control={control}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                />
              </div>
            </Col>
            {/* <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="role"
                  placeholder="Enter the Role"
                  label="Role"
                />
              </div>
            </Col> */}
            {/* <Col lg={6}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="group_name"
                  placeholder="Enter the Group"
                  label="Group Name"
                />
              </div>
            </Col> */}
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
          <button type="submit" className="w-100 text-dark" style={{ border:'2px solid #A4895C',borderRadius:'4px',height:'40px'}}onClick={() => reset()}>
              Cancel
              </button>
          </Col>
          <Col lg={2}>
         
          <button type="submit" className="w-100 text-light" style={{ backgroundColor: "#A4895C",border:'2px solid #A4895C',borderRadius:'4px',height:'40px'}}>
              Create Instructor
            </button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddInstructor;
