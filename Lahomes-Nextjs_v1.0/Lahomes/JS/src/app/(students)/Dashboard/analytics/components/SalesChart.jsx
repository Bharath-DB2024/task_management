"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StudentTaskChart = () => {
    const [chartData, setChartData] = useState({ instructors: [], totalTasks: [], completedTasks: [] });
    const chartContainerRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(600);

    useEffect(() => {
        const fetchTaskData = async () => {
            const student = localStorage.getItem("student_unique_id");

            if (!student) {
                console.error("Student unique ID not found");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/getTask/${student}`);
                const data = response.data;

                const instructors = data.map(item => item.instructor.name);
                const totalTasks = data.map(item => item.instructor.total_tasks);
                const completedTasks = data.map(item => item.instructor.completed_tasks);

                setChartData({ instructors, totalTasks, completedTasks });
            } catch (error) {
                console.error("Error fetching task data:", error);
            }
        };

        fetchTaskData();
    }, []);

    useEffect(() => {
        // Resize the chart based on the container width
        const handleResize = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.offsetWidth - 20);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const chartOptions = {
        chart: { type: "bar", toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: "75%" } },
        xaxis: {
            categories: chartData.instructors,
            title: { text: "Instructors" },
            labels: { rotate: -45 }
        },
        yaxis: {
            title: { text: "Number of Tasks" },
            min: 0,
            labels: { formatter: value => Math.round(value) }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        responsive: [
            {
                breakpoint: 768,
                options: { chart: { width: "100%" } }
            }
        ]
    };

    const series = [
        { name: "Total Tasks", data: chartData.totalTasks },
        { name: "Completed Tasks", data: chartData.completedTasks }
    ];

    return (
        <div className="container mt-4">
            <h4 className="text-center">Task Analysis</h4>
            <div ref={chartContainerRef} style={{ overflowX: "auto", maxWidth: "100%", marginBottom: "20px" }}>
                {chartData.instructors.length > 0 ? (
                    <ReactApexChart options={chartOptions} series={series} type="bar" height={450} width={chartWidth} />
                ) : (
                    <p className="text-center">Loading chart data...</p>
                )}
            </div>
        </div>
    );
};

export default StudentTaskChart;
