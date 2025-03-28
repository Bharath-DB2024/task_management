'use client';

import { Card, CardBody, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import instIcon from '../../../icons/Instructor.svg';
import stuIcon from '../../../icons/Student.svg';
import groupIcon from '../../../icons/Group-1.svg';



const Statistics = () => {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalStudents: 0,
    totalGroups: 0
  });

  useEffect(() => {
    const userId = localStorage.getItem('admin_unique_id');   
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
    <div className="container">

      <Row className="justify-content-start">
    
        <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
          <Card >
            <CardBody>
              <Row className="align-items-center">
               
                <Col xs={6}>
                  <h4>Instructors</h4>
                  <h1 className="text-dark fw-bold">{stats.totalInstructors}</h1>
                </Col>
                <Col xs={6}>
                <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered" style={{ width: '100px', height: '100px' }}>
                    <Image src={instIcon} width={100} height={100} alt="instructor icon" />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
          <Card>
            <CardBody>
              <Row className="align-items-center">
              <Col xs={6}>
                  <h4>Students</h4>
                  <h1 className="text-dark fw-bold">{stats.totalStudents}</h1>
                </Col>
                <Col xs={6}>
                <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered" style={{ width: '100px', height: '100px' }}>
                    <Image src={stuIcon}  width={100} height={100} alt="student icon" />
                  </div>
                </Col>
                
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3} lg={3} className="mb-4">
          <Card>
            <CardBody>
              <Row className="align-items-center">
             
                <Col xs={6}>
                  <h4>Groups</h4>
                  <h1 className="text-dark fw-bold">{stats.totalGroups}</h1>
                </Col>
                <Col xs={6}>
                <div className="avatar-md bg-light bg-opacity-50 rounded flex-centered" style={{ width: '100px', height: '100px' }}>
                    <Image src={groupIcon}  width={100} height={100} alt="group icon" />
                  </div>
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
