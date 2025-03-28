'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import TextFormInput from '@/components/from/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, Col, Row, Alert, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddTask = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = localStorage.getItem('instructor_unique_id');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getGroup/${id}`);
        setGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, [id]);

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = moment(date).format('DD-MM-YYYY');
      setExpiryDate(formattedDate);
      setValue('date', formattedDate); 
    }
  };

  const messageSchema = yup.object({
    name: yup.string().required('Please enter name'),
    group_name: yup.string().required('Please enter group name'),
    date: yup.string().required('Please enter date'),
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
  
  const { handleSubmit, control, reset, register, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(messageSchema),
  });


  const onSubmit = async (data) => {
  
    setMessage(null);
    setError(null);

    const requestData = {
      task_name: data.name,
      group_name: data.group_name,
      expiry_date: moment(data.date, 'DD-MM-YYYY').format('DD-MM-YYYY'),
      instructor: id,
    };

    try {
      const response = await axios.post('http://localhost:5000/addTask', requestData);
      showAlertModal("Success", "Task Added");
      reset();
      setExpiryDate('');
    } catch (err) {
      console.error('Error:', err);
      showAlertModal("Error", "Error deleting task.",err.response?.data?.error || 'Something went wrong');
    }
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
        <CardBody style={{ width: '100%' }}>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="name" placeholder="Enter the Task" label="Name" />
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <Form.Group>
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control as="select" {...register('group_name')} required>
                    <option value="all">All</option>
                    {groups.map((group) => (
                      <option key={group} value={group.trim()}>
                        {group.trim()}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            </Col>

            <Col lg={6}>
              <div className="mb-3">
                <Form.Group>
                  <Form.Label>Expiry Date</Form.Label>
                  <DatePicker
                    selected={expiryDate ? moment(expiryDate, 'DD-MM-YYYY').toDate() : null}
                    onChange={handleDateChange}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    placeholderText="DD-MM-YYYY"
                  />
                </Form.Group>
              </div>
            </Col>
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
                    Add Task
                  </button>
                </Col>
              </Row>
      </div>
    </form>
  );
};

export default AddTask;
