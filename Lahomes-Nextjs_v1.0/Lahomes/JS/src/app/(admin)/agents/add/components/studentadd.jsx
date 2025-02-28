'use client';

import { useState } from 'react';
import axios from 'axios';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const AgentAdd = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const messageSchema = yup.object({
    name: yup.string().required('Please enter name'),
    groupName: yup.string().required('Please enter Group Name'),
    zipCode: yup.string().required('Please enter Zip-Code'),
    email: yup.string().email().required('Please enter email'),
    number: yup.string().required('Please enter number'),
    city: yup.string().required('Please enter City'),
    country: yup.string().required('Please enter Country')
  });

  const { handleSubmit, control, reset, getValues } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const onSubmit = async (data) => {
    console.log("Submitting data:", data);
    try {
      const response = await axios.post('http://localhost:5000/customers', data);
      setMessage('Customer added successfully!');
      setError(null);
      reset();
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Failed to add customer');
      setMessage(null);
    }
  };

  // Function to handle form submission manually
  const handleFormSubmit = () => {
 console.log("hello");
 
    handleSubmit(onSubmit)();
  };

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle as="h4">Instructor Information</CardTitle>
        </CardHeader>
        <CardBody>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="name" placeholder="Full Name" label="Instructor Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="groupName" placeholder="Enter Group Name" label="Group Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="email" placeholder="Enter Email" label="Instructor Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="number" type="number" placeholder="Enter Number" label="Instructor Number" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="zipCode" type="number" placeholder="Zip-Code" label="Zip-Code" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="city" type="text" placeholder="Enter City" label="City" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="country" type="text" placeholder="Enter Country" label="Country" />
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="outline-primary" className="w-100" onClick={()=>{console.log("hello")}}>
              Create Instructor
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

export default AgentAdd;
