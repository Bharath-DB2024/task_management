'use client';

import { useState } from 'react';
import axios from 'axios';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const AddStudent = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

 const id= localStorage.getItem("instructor_unique_id");
  const messageSchema = yup.object({
    name: yup.string().required('Please enter name'),
    email: yup.string().email().required('Please enter email'),
    password: yup.string().required('Please enter password'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm password'),
     group_name: yup.string().required('Please enter group name'),
     role: yup.string().required('Please enter role'),
  });

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(messageSchema),
  });

  const onSubmit = async (data) => {
    alert("Student Registered")
    setMessage(null);
    setError(null);
    console.log("Submitting data:", data);
    
    const requestData = {
      ...data,
      instructor:id
    };
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API+'/register', requestData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Student Added!');
      reset();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
      
        <CardBody style={{width:"100%"}}>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="name" placeholder="Full Name" label=" Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="email" placeholder="Enter Email" label=" Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="password" type="password" placeholder="Enter Password" label="Enter Password" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="confirmPassword" type="password" placeholder="Confirm Password" label="Confirm Password" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="role" placeholder="Enter the  Role" label="Role" />
              </div>
            </Col>
          
            <Col lg={6} >
              <div className="mb-3">
                <TextFormInput control={control} name="group_name" placeholder="Enter the  Group" label=" Group Name" />
              </div>
            </Col>
     
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button type="submit" variant="outline-primary" className="w-100">
              Create Student
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="danger" className="w-100" onClick={() => reset()}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddStudent;
