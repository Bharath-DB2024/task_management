"use client";


import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'next/navigation';


const StudentChart = () => {

  const [chartData, setChartData] = useState(null);
  const searchParams = useSearchParams();
  const studentId = searchParams.get('student_id');

  useEffect(() => {
    if (studentId) {
      fetch('http://localhost:5000/getStudentTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId })
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.total_task !== undefined && data.completed_task !== undefined && data.not_completed_task !== undefined) {
          setChartData(data);
        }
      })
      .catch(error => console.error('Error fetching task data:', error));
    }
  }, [studentId]);


  if (!chartData) {
    return <p className="text-center text-muted">Loading chart data...</p>;
  }

  if (!chartData || chartData.total_task === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-primary text-center">No task for this Student</h2>
      </div>
    );
  }

  const totalTasks = chartData?.total_task || 0;
  const completedTasks = chartData?.completed_task || 0;
  const notCompletedTasks = chartData?.not_completed_task || 0;  
  const percentage = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  const options = {
    chart: { type: 'donut', height: 350, toolbar: { show: false } },
    labels: ['Completed Tasks', 'Not Completed Tasks'],
    colors: ["#28a745","#1E90FF"],
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true
          }
        }
      }
    },
    dataLabels: {
      formatter: function (value) {
        return value !== undefined ? value.toFixed(1) : '0.0'; 
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value !== undefined ? `${value}` : 'N/A'; 
        }
      }
    },
    legend: { position: 'bottom' }
  };

  const series = [
    Number(completedTasks) || 0, 
    Number(notCompletedTasks) || 0
  ];
  
  if (series.some(value => value === undefined || value === null)) {
    console.error('Series contains undefined or null values:', series);
    return <p>Error: Invalid chart data</p>;
  }

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0 rounded-4 mb-4"style={{width:'80%'}}>
            <Row className="h-100">
              <Col md={6} className="d-flex flex-column justify-content-center p-4">
                <Card.Body>
                  <h3 className="text-primary text-center mb-4">Student Task Status</h3>
                  <ul className="list-unstyled">
                    <li><p className="fs-16"><strong>Student Name:</strong> {chartData?.student_name || 'Unknown'}</p></li>
                    <li><p className="fs-16"><strong>Student Group:</strong>{chartData?.student_group}</p></li>
                    <li><p className="fs-16"><strong>Total Tasks:</strong> {totalTasks}</p></li>
                    <li><p className="fs-16"><strong>Completed Tasks:</strong> {completedTasks}</p></li>
                    <li><p className="fs-16"><strong>Not Completed Tasks:</strong> {notCompletedTasks}</p></li>
                    <li><p className="fs-16"><strong>Completion Percentage:</strong> {percentage}%</p></li>
                  </ul>
                </Card.Body>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-center">

              {series && series.length > 0 && options && (
                <ReactApexChart options={options} series={series} type="donut" width={300} height={350} />
               )}

              </Col>
            </Row>
          </Card>
        </Col>
            </Row>

    </div>
  );
 } ;


export default StudentChart;










