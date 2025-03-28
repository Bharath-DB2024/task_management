'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GrpTaskChart = () => {
    const [chartData, setChartData] = useState({ groupNames: [], totalTasks: [], completedTasks: [] });
    const [chartWidth, setChartWidth] = useState("100%");

    useEffect(() => {
        const fetchTaskData = async () => {
            const id = localStorage.getItem('admin_unique_id');
      
            if (!id) {
                console.error('Admin unique ID not found');
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:5000/grpTask/${id}`);
                const data = response.data;
    
                if (data.role === "admin" || data.role === "instructor") {
                  
                    const groupsWithData = data.groups.filter(group => 
                        group.total_tasks > 0 || group.completed_tasks > 0
                    );
    
                    if (groupsWithData.length === 0) {
                        setChartData({ groupNames: [], totalTasks: [], completedTasks: [] });
                        return;
                    }
    
                    const groupNames = groupsWithData.map(item => item.group_name);
                    const totalTasks = groupsWithData.map(item => item.total_tasks);
                    const completedTasks = groupsWithData.map(item => item.completed_tasks);
    
                    setChartData({ groupNames, totalTasks, completedTasks });

                    if (groupNames.length > 6) {
                        setChartWidth(Math.min(groupNames.length * 120, window.innerWidth - 50));
                    } else {
                        setChartWidth("100%");
                    }
    
                } 
                else if (data.role === "student") {
                 
                    if (data.tasks.total_tasks > 0 || data.tasks.completed_tasks > 0) {
                        setChartData({
                            groupNames: ["Tasks"],
                            totalTasks: [data.tasks.total_tasks],
                            completedTasks: [data.tasks.completed_tasks]
                        });
                    } else {
                        setChartData({ groupNames: [], totalTasks: [], completedTasks: [] });
                    }
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };
    
        fetchTaskData();
    }, []);


    const isDataEmpty = chartData.groupNames.length === 0 || 
                   (chartData.totalTasks.every(task => task === 0) && 
                    chartData.completedTasks.every(task => task === 0));

        if (isDataEmpty) {
            return <div>No data available</div>;
        }

    const chartOptions = {
        chart: { type: "bar", toolbar: { show: false }, background: "transparent", dropShadow: { enabled: true, color: "#000", opacity: 0.35, blur: 5 }},
        plotOptions: { bar: { columnWidth: "50%", borderRadius: 4, horizontal: false } },
        xaxis: { categories: chartData.groupNames,  title: { text: "Instructors", style: { fontSize: "14px", fontWeight: "bold", fontFamily: "Arial, sans-serif" } },labels: { rotate: -45, style: { fontSize: "12px", fontFamily: "Arial, sans-serif" } },},
        yaxis: { title: { text: "Number of Tasks", style: { fontSize: "14px", fontWeight: "bold", fontFamily: "Arial, sans-serif" } }, min: 0,labels: { formatter: value => Math.round(value) },},
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        legend: { position: "top", horizontalAlign: "right",markers: { radius: 6 }, fontSize: "14px",fontFamily: "Arial, sans-serif"},
        tooltip: {  theme: "light", style: { fontSize: "12px", fontFamily: "Arial, sans-serif" },onDatasetHover: { highlightDataSeries: true } },
        colors: ["#1E90FF", "#72C02C"],    
        fill: { type: "gradient",
            gradient: {shade: 'dark',type: "vertical",shadeIntensity: 0.5,gradientToColors: ["#4A90E2", "#28A745"], inverseColors: true,opacityFrom: 1,opacityTo: 0.6,stops: [0, 100]}
        }
    };

    const series = [
        { name: "Total Tasks", data: chartData.totalTasks },
        { name: "Completed Tasks", data: chartData.completedTasks },
    ];

    return (
        <div style={styles.chartContainer}>
                <h3 style={styles.title}>Group Task Performance</h3>
            <div style={styles.chartWrapper}>
                <ReactApexChart options={chartOptions} series={series} type="bar" height={450} width={chartWidth} />
            </div>
        </div>
    );
};

const styles = {
    chartContainer: {
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        margin: '20px auto',
        maxWidth: '85%',
        marginLeft: '50px'
    },
    title: {
        fontSize: "22px",
        color: "#222222",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        marginBottom: "15px",
    },
    chartWrapper: {
        overflowX: "auto",
        overflowY:"auto",
        maxWidth: "100%",
        padding: "10px",
    },
    noData: {
        textAlign: "center",
        fontSize: "16px",
        color: "#999",
        marginTop: "20px",
    },
};

export default GrpTaskChart;
