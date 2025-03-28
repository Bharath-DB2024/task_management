"use client";

import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { useSearchParams } from 'next/navigation';


const InstChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);;
  const searchParams = useSearchParams();
  const instructorId = searchParams.get("instructor_id");


  useEffect(() => {

    if (instructorId) {
      fetch("http://localhost:5000/getInsTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instructorId }),
      })
        .then((response) => {
          return response.json();
        })
        
        .then((data) => {
          setChartData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching task data:", error);
          setLoading(false);
        });
       
    } else {
      console.log("No instructorId");
    }
  }, []);

  if (loading) {
    return <p className="text-center text-muted">Loading chart data...</p>;
  }

  if (!chartData) {
    return <p className="text-center text-muted">Loading chart data...</p>;
  }


  const totalTasks = chartData?.total_task || 0;
  const completedTasks = chartData?.completed_task || 0;
  const notCompletedTasks = chartData?.not_completed_task || 0;
  const percentage = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  if (totalTasks === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-primary text-center">No task for this Instructor</h2>
      </div>
    );
  }

  const series = [completedTasks, notCompletedTasks] || [];
  const labels = ["Completed Tasks", "Not Completed Tasks"];

  const options = {
    chart: { type: "donut", height: 350, toolbar: { show: false } },
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
          },
        },
      },
    },
    dataLabels: { enabled: true },
    legend: { position: "bottom" },
    colors: ["#28a745","#1E90FF"]
  };

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg border-0 rounded-4 mb-4"style={{width:'80%'}}>
            <Row className="h-100">
              <Col md={6} className="d-flex flex-column justify-content-center p-4">
                <Card.Body>
                  <h3 className="text-primary text-center mb-4">Instructor Task Status</h3>
                  <ul className="list-unstyled">
                    <li>
                      <p className="fs-16">
                        <strong>Instructor:</strong> <span>{chartData?.instructor_name || "Unknown"}</span>
                      </p>
                    </li>
                    <li>
                      <p className="fs-16">
                        <strong>Total Tasks:</strong> {totalTasks}
                      </p>
                    </li>
                    <li>
                      <p className="fs-16">
                        <strong>Completed Tasks:</strong> {completedTasks}
                      </p>
                    </li>
                    <li>
                      <p className="fs-16">
                        <strong>Pending Tasks:</strong> {notCompletedTasks}
                      </p>
                    </li>
                    <li>
                      <p className="fs-16">
                        <strong>Completion Percentage:</strong> {percentage}%
                      </p>
                    </li>
                  </ul>
                </Card.Body>
              </Col>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <ReactApexChart options={options} series={series} type="donut" width={300} height={350}style={{marginTop:'20px'}}/>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* <Col md={10}>
          {chartData.total_task > 0 ? (
            <Card className="shadow-lg border-0 rounded-4" style={{width:'80%'}}>
              <Row className="h-100">
                <Col md={6} className="d-flex flex-column justify-content-center p-4">
                  <Card.Body>
                    <h3 className="text-primary text-center mb-4">Group Task Status</h3>
                    <InstGrpTaskSummary instructorId={instructorId} />
                  </Card.Body>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-center">
                  <InstGrpChart instructorId={instructorId} />
                </Col>
              </Row>
            </Card>
          ) : null}
        </Col> */}


      </Row>
    </div>
  );
};



const InstGrpChart = ({ instructorId }) => {
  const [taskSummary, setTaskSummary] = useState([]);
  const [chartData, setChartData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      if (instructorId) {
        try {
          const response = await fetch("http://localhost:5000/getInstGrpTask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ instructorId }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          setChartData(data);
          setTaskSummary(data.taskSummary || []);
        } catch (error) {
          console.error("Error fetching task summary:", error);
        }
      }
    };

    fetchData();
  }, [instructorId]);

  if (!chartData) {
    return <p className="text-center text-muted">Loading chart data...</p>;
  }

  const totalTasks = chartData?.total_task || 0;

  if (!chartData || chartData.total_task === 0) {
    return null;
  }

  const series = taskSummary.map((group) => group.totalTasks || 0);
  const labels = taskSummary.map((group) => group.instructorName || "Unknown Instructor");

  if (series.length === 0 || labels.length === 0) {
    return <p className="text-center text-muted">No data available for the chart.</p>;
  }



  const chartOptions = {
    chart: { type: "donut", height: 200 },
    labels: labels.length > 0 ? labels : ["No Data"],
    plotOptions: { pie: { donut: { size: "50%" } } },
    dataLabels: { enabled: true },
    legend: { position: "bottom" }
  };

  return (
    <div>
      <ReactApexChart options={chartOptions} series={series.map((value) => value || 0)} type="donut" width={300} height={300} />
    </div>
  );
};



const InstGrpTaskSummary = ({ instructorId }) => {
  const [taskSummary, setTaskSummary] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (instructorId) {
      fetch("http://localhost:5000/getInstGrpTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instructorId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTaskSummary(data.taskSummary);
          setChartData(data);
          setGroupName(data.groupName);
        })
        .catch((error) => console.error("Error fetching task summary:", error));
    }
  }, [instructorId]);


  if (!chartData) {
    return <p className="text-center text-muted">Loading chart data...</p>;
  }

  const totalTasks = chartData?.total_task || 0;

  console.log("Chart Data:", chartData);
  console.log("Total Task:", totalTasks);


  if (!chartData || chartData.total_task === 0) {
    return null;
  }

  return (
    <div>
      <strong><h4><b>Total Task:</b> {taskSummary.reduce((total, group) => total + group.totalTasks, 0)}</h4></strong>
      <br />
      {taskSummary.length > 0 ? (
        <ul className="list-group">
          {taskSummary.map((group, index) => (
            <li key={index} className="list-group-item">
              <p className="fs-17">
                <strong>Instructor Name:</strong> {group.instructorName}
              </p>
              <p className="fs-17">
                <strong>Group:</strong> {groupName || "Unknown Group"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">Loading group task summary...</p>
      )}
    </div>
  );

};


export default InstChart;
