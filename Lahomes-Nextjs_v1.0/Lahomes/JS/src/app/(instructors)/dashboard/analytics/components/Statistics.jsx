'use client';

import { Card, CardBody, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import stuIcon from '../../../icons/Student.svg';
import groupIcon from '../../../icons/Group.svg';
import taskIcon from '../../../icons/Task.svg';
import completeIcon from '../../../icons/Task completed.svg';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGroups: 0,
    totalTasks:0,
    completedTasks:0
  });

  useEffect(() => {
    const userId = localStorage.getItem('instructor_unique_id');   
    const role = localStorage.getItem('role');

    if (!userId || !role) {
        console.error('User ID or role not found in local storage.');
        return;
    }

    axios
        .post('http://localhost:5000/getTotal', { role, userId })
        .then((response) => {
            setStats(response.data);
        })
        .catch((error) => {
            console.error('Error fetching statistics:', error);
        });
}, []);


  return (
    
    <div className="container-fluid">
      <Row className="justify-content-center">
  
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card className="shadow-sm">
            <CardBody>
              <Row className="align-items-center text-center text-md-start">
                <Col xs={12} md={6}>
                  <h4>Students</h4>
                  <h1 className="text-dark fw-bold">{stats.totalStudents}</h1>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-center">
                  <Image src={stuIcon} width={90} height={100} alt="Students Icon" style={{ opacity: 0.8,marginLeft:"70px"}} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

     
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card className="shadow-sm">
            <CardBody>
              <Row className="align-items-center text-center text-md-start">
                <Col xs={12} md={6}>
                  <h4>Groups</h4>
                  <h1 className="text-dark fw-bold">{stats.totalGroups}</h1>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-center">
                  <Image src={groupIcon} width={90} height={100} alt="Groups Icon" style={{ opacity: 0.8,marginLeft:"70px"}} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

  
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card className="shadow-sm">
            <CardBody>
              <Row className="align-items-center text-center text-md-start">
                <Col xs={12} md={6}>
                  <h4>Task</h4>
                  <h1 className="text-dark fw-bold">{stats.totalTasks}</h1>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-center">
                  <Image src={taskIcon} width={90} height={100} alt="Tasks Icon" style={{ opacity: 0.8,marginLeft:"70px"}} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

     
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card className="shadow-sm">
            <CardBody>
              <Row className="align-items-center text-center text-md-start">
                <Col xs={12} md={6}>
                  <h4>Completed</h4>
                  <h1 className="text-dark fw-bold">{stats.completedTasks}</h1>
                </Col>
                <Col xs={12} md={6} className="d-flex justify-content-center">
                  <Image src={completeIcon} width={90} height={100} alt="Completed Icon" style={{ opacity: 0.8,marginLeft:"70px"}} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>

  );
};

export default Statistics;
