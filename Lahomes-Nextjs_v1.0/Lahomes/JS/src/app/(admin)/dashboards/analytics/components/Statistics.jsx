'use client';

import { Card, CardBody, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import instIcon from '../../../icons/Instructor.svg';
import stuIcon from '../../../icons/Student.svg';
import groupIcon from '../../../icons/Group.svg';
import completeIcon from '../../../icons/Task completed.svg';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalInstructors: 0,
    totalStudents: 0,
    totalGroups: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem('admin_unique_id');   
    const role = localStorage.getItem('role');

    if (!userId || !role) {
        console.error('User ID or role not found');
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
    <div className="container-fluid px-4">
      <Row className="d-flex justify-content-between">
        {[
          { label: "Instructors", count: stats.totalInstructors, icon: instIcon },
          { label: "Students", count: stats.totalStudents, icon: stuIcon },
          { label: "Groups", count: stats.totalGroups, icon: groupIcon },
          { label: "Task", count: stats.completedTasks, icon: completeIcon },
        ].map((item, index) => (
          <Col key={index} xs={12} sm={6} md={3} className="d-flex">
            <Card className="shadow-sm flex-grow-1 h-85">
              <CardBody className="d-flex align-items-center justify-content-between p-2">
             
                <div>
                  <h4>{item.label}</h4>
                  <h1 className="text-dark fw-bold">{item.count}</h1> 
                </div>

                <div>
                  <Image src={item.icon} width={90} height={100} style={{ opacity: 0.8 }}alt={`${item.label} Icon`} />
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Statistics;
