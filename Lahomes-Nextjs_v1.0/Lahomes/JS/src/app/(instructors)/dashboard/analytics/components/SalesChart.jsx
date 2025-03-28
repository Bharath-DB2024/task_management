'use client';

import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';


const AdminInstructorTaskChart = () => {
    
    const [chartData, setChartData] = useState({ instructors: [], totalTasks: [], completedTasks: []});

    useEffect(() => {
        const fetchTaskData = async () => {
            const instructor = localStorage.getItem('instructor_unique_id');
      
            if (!instructor) {
                console.error('Instructor unique ID not founde');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/getTask/${instructor}`);
                const data = response.data;

                const instructors = data.map(item => item.instructor.name);
                const totalTasks = data.map(item => item.instructor.total_tasks);
                const completedTasks = data.map(item => item.instructor.completed_tasks);

                setChartData({ instructors, totalTasks, completedTasks});
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, []);

    const isDataEmpty = !chartData.totalTasks || chartData.totalTasks.every(task => task === 0);

       if (isDataEmpty) {
        return (
            // <div className="container mt-5">
            //     <h2 className="text-primary text-center">No Group</h2>
            // </div> 
            null
        );
    }

    const chartOptions = {
        chart: { type: 'bar',toolbar: { show: false }  },
        plotOptions: {bar: {columnWidth: '75%'}},
        xaxis: { categories: chartData.instructors, title: { text: 'Instructors' },  labels: { rotate: -45 }  },
        yaxis: { title: { text: 'Number of Tasks' }, min: 0, labels: { formatter: value => Math.round(value) } },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' }
    };

    const series = [
        { name: 'Total Tasks', data: chartData.totalTasks },
        { name: 'Completed Tasks', data: chartData.completedTasks }
    ];

    return (
        <div>
            <h4>Instructor Task Analysis</h4>
         
            {chartData.instructors.length > 0 ? (
               <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '20px' }}>
                    <ReactApexChart options={chartOptions} series={series} type="bar" height={450}  width={chartData.instructors.length > 10 ? 1000 : 1000} />
                </div>
             ) : (
                <p>Loading chart data...</p>
            )}
        </div>

    );
};


export default AdminInstructorTaskChart;