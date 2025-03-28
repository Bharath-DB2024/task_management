'use client';


import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const GrpTaskChart = () => {
    const [chartData, setChartData] = useState({ groupNames: [], totalTasks: [], completedTasks: [], notCompletedTasks: [] });
    const [chartWidth, setChartWidth] = useState("100%");

    useEffect(() => {
        const fetchTaskData = async () => {
            const id = localStorage.getItem('instructor_unique_id');
    
            if (!id) {
                console.error('Instructor unique ID not found');
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:5000/grpTask/${id}`);
                const groups = response.data.groups;
                
                const groupsWithData = groups.filter(group => 
                    group.total_tasks > 0 || 
                    group.completed_tasks > 0 || 
                    group.not_completed_tasks > 0
                );
    
                if (groupsWithData.length === 0) {
                    setChartData({ 
                        groupNames: [], 
                        totalTasks: [], 
                        completedTasks: [], 
                        notCompletedTasks: [] 
                    });
                    return;
                }
    
                const groupNames = groupsWithData.map(item => item.group_name);
                const totalTasks = groupsWithData.map(item => item.total_tasks);
                const completedTasks = groupsWithData.map(item => item.completed_tasks);
                const notCompletedTasks = groupsWithData.map(item => item.not_completed_tasks);
    
                setChartData({ groupNames, totalTasks, completedTasks, notCompletedTasks });
    
                if (groupNames.length > 6) {
                    setChartWidth(Math.min(groupNames.length * 120, window.innerWidth - 50));
                } else {
                    setChartWidth("100%");
                }
    
            } catch (error) {
                console.error('Error fetching task data:', error);
                setChartData({ 
                    groupNames: [], 
                    totalTasks: [], 
                    completedTasks: [], 
                    notCompletedTasks: [] 
                });
            }
        };
    
    
        fetchTaskData();
        window.addEventListener("resize", () => setChartWidth(window.innerWidth > 768 ? "100%" : "100%"));
    
    
        return () => window.removeEventListener("resize", () => {});
    }, []);
    
    const isDataEmpty = chartData.groupNames.length === 0 || 
                       chartData.totalTasks.every(task => task === 0) &&
                       chartData.completedTasks.every(task => task === 0) &&
                       chartData.notCompletedTasks.every(task => task === 0);
    
    if (isDataEmpty) {
        return null;
    }

    const chartOptions = {
        chart: { type: "bar", toolbar: { show: false }, background: "transparent",dropShadow: { enabled: true, color: "#000", opacity: 0.35, blur: 5 }},
        plotOptions: { bar: { columnWidth: "50%", borderRadius: 4, horizontal: false } },
        xaxis: { categories: chartData.groupNames, title: { text: 'Groups' },style: { fontSize: "14px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }, labels: { rotate: -45 } },
        yaxis: { title: { text: 'Number of Tasks' },style: { fontSize: "14px", fontWeight: "bold", fontFamily: "Arial, sans-serif" },min: 0, labels: { formatter: value => Math.round(value) } },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        legend: {position: "top",horizontalAlign: "right",markers: { radius: 6 },fontSize: "14px",fontFamily: "Arial, sans-serif"},
        tooltip: { theme: "light", style: { fontSize: "12px", fontFamily: "Arial, sans-serif" },onDatasetHover: { highlightDataSeries: true }},
        colors: ["#1E90FF", "#72C02C"],    
        fill: { type: "gradient",
           gradient: { shade: 'dark', type: "vertical", shadeIntensity: 0.5,gradientToColors: ["#4A90E2", "#28A745"],  inverseColors: true,opacityFrom: 1,opacityTo: 0.6, stops: [0, 100]}
        }
    };

    
    const series = [
        { name: 'Total Tasks', data: chartData.totalTasks },
        { name: 'Completed Tasks', data: chartData.completedTasks },
        { name: 'Not Completed Tasks', data: chartData.notCompletedTasks, color: '#FF3333' },
    ];

    return (
        <div style={styles.chartContainer}>
          <h3 style={styles.title}>Group Task Performance</h3>
            <div style={styles.chartWrapper}>
                <ReactApexChart options={chartOptions} series={series} type="bar" height={450} width={chartData.groupNames.length > 10 ? 1000 : '100%'} />
            </div>
        </div>
    );
};


const styles = {
    chartContainer: {
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        margin: '20px auto',
        maxWidth: '94%'
    },
    title: {
        fontSize: "22px",
        color: "#222222",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        marginBottom: "15px",
    },
    chartWrapper: {
        overflowX: 'auto',
        overflowY: 'auto',
        maxWidth: '100%',
        padding: '10px',
    },
    loadingText: {
        fontSize: '16px',
        color: '#555',
    },
};

export default GrpTaskChart;
