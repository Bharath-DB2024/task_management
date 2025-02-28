'use client';

import axios from 'axios';
import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const AddCustomer = () => {
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
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card style={{ justifyContent: "left" }}>
        <CardHeader>
          <CardTitle as="h4">Student Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="name" placeholder="Full Name" label="Student Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="email" placeholder="Enter Email" label="Student Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="password"  type="password" placeholder="Enter Email" label="Student Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="passward"  type="password" placeholder="Enter Email" label="Student Email" />
              </div>
            </Col>
            {/* <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="number" type="number" placeholder="Enter Number" label="Student Number" />
              </div>
            </Col> */}
            {/* <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="zipCode" type="number" placeholder="Zip-Code" label="Zip-Code" />
              </div>
            </Col> */}
            {/* <Col lg={6}>
              <div className="mb-3">
                <TextAreaFormInput control={control} name="description" type="text" label="Student Address" rows={3} placeholder="Enter address" />
              </div>
            </Col> */}
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button variant="danger" className="w-100">
              Cancel
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="outline-primary" type="submit" className="w-100">
              Create Customer
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AddCustomer;
