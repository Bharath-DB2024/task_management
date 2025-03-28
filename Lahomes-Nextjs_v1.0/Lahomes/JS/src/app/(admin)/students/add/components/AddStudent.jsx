'use client';

import axios from 'axios';
import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const AddStudent = () => {
  const messageSchema = yup.object({
    name: yup.string().required('Please enter name'),
    description: yup.string().required('Please enter description'),
    zipCode: yup.string().required('Please enter Zip-Code'),
    email: yup.string().email().required('Please enter email'),
    number: yup.string().required('Please enter number'),
    propertiesNumber: yup.string().required('Please enter Properties Number'),
    facebookUrl: yup.string().required('Please enter Facebook Url'),
    instagramUrl: yup.string().required('Please enter Instagram Url'),
    twitterUrl: yup.string().required('Please enter Twitter Url'),
    viewProperties: yup.string().required('Please enter view properties'),
    ownProperties: yup.string().required('Please enter own Properties')
  });

  const {
    handleSubmit,
    control,
    reset
  } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/customers', data);
      alert('Customer added successfully!');
      reset(); 
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card style={{ justifyContent: "left" }}>
     
        <CardBody>
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
