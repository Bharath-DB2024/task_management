// 'use client';

// import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import axios from 'axios';

// const GrpTaskChart = () => {
//     const [chartData, setChartData] = useState({ totalTasks: [], completedTasks: [], notCompletedTasks: [] });

//     useEffect(() => {
//         const fetchTaskData = async () => {
//             const id = localStorage.getItem('student_unique_id');

//             if (!id) {
//                 console.error('Student unique ID not found in local storage');
//                 return;
//             }

//             try {
//                 const response = await axios.get(`http://localhost:5000/grpTask/${id}`);

//                 if (response.data.role === 'student') {
//                     const { total_tasks, completed_tasks, not_completed_tasks } = response.data.tasks;

//                     setChartData({
//                         totalTasks: [total_tasks],
//                         completedTasks: [completed_tasks],
//                         notCompletedTasks: [not_completed_tasks]
//                     });

//                 } else {
//                     const groups = response.data.groups;
//                     const totalTasks = groups.map(item => item.total_tasks);
//                     const completedTasks = groups.map(item => item.completed_tasks);
//                     const notCompletedTasks = groups.map(item => item.not_completed_tasks);

//                     setChartData({ totalTasks, completedTasks, notCompletedTasks });
                 
//                 }
//             } catch (error) {
//                 console.error('Error fetching task data:', error);
//             }
//         };

//         fetchTaskData();
//     }, []);

//     const isDataEmpty =
//         !chartData.totalTasks ||
//         (chartData.totalTasks.length === 1 && chartData.totalTasks[0] === 0);

//     if (isDataEmpty) {
//         return <p>No task data available</p>;
//     }

//     const chartOptions = {
//         chart: { type: 'bar', height: 350, toolbar: { show: false } },
//         plotOptions: { bar: { columnWidth: '50%' } },
//         xaxis: {
//             categories: ['Total', 'Completed', 'Not Completed'], 
//             title: { text: 'My Task' },
//             labels: { rotate: -45 }
//         },
//         yaxis: {
//             title: { text: 'Number of Tasks' },
//             min: 0,
//             labels: { formatter: value => Math.round(value) }
//         },
//         dataLabels: { enabled: false },
//         grid: { show: true }
//     };

//     const series = [
//         {
//             name: 'Tasks',
//             data: [
//                 chartData.totalTasks[0] || 0,
//                 chartData.completedTasks[0] || 0,
//                 chartData.notCompletedTasks[0] || 0
//             ]
//         }
//     ];

    
//     return (
//         <div>
//             <h4>Task Analysis</h4>
//             {series[0].data.some(value => value > 0) ? (
//                 <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '20px' }}>
//                     <ReactApexChart
//                         options={chartOptions}
//                         series={series}
//                         type="bar"
//                         height={450}
//                         width={500}
//                     />
//                 </div>
//             ) : (
//                 <p>Loading chart data...</p>
//             )}
//         </div>
//     );
// };

// export default GrpTaskChart;
















'use client';

import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';


const GrpTaskChart = () => {
    const [chartData, setChartData] = useState({ totalTasks: 0, completedTasks: 0, notCompletedTasks: 0 });

    useEffect(() => {
        const fetchTaskData = async () => {
            const id = localStorage.getItem('student_unique_id');

            if (!id) {
                console.error('Student unique ID not found');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/grpTask/${id}`);

                if (response.data.role === 'student') {
                    const { total_tasks, completed_tasks, not_completed_tasks } = response.data.tasks;

                    setChartData({
                        totalTasks: total_tasks || 0,
                        completedTasks: completed_tasks || 0,
                        notCompletedTasks: not_completed_tasks || 0
                    });

                } else {
                    const groups = response.data.groups;
                    const totalTasks = groups.reduce((sum, item) => sum + item.total_tasks, 0);
                    const completedTasks = groups.reduce((sum, item) => sum + item.completed_tasks, 0);
                    const notCompletedTasks = groups.reduce((sum, item) => sum + item.not_completed_tasks, 0);

                    setChartData({ totalTasks, completedTasks, notCompletedTasks });
                }
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTaskData();
    }, []);

    const isDataEmpty =
        chartData.completedTasks === 0 &&
        chartData.notCompletedTasks === 0;

    if (isDataEmpty) {
        return <p>No task data available</p>;
    }

    const chartOptions = {
        chart: { type: 'donut', height: 350, toolbar: { show: false }},
        labels: ['Completed Tasks', 'Not Completed Tasks'],
        colors: [ '#00E396', '#FF4560'],
        legend: {
            position: 'bottom',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 100
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    
    const series = [
        chartData.completedTasks,
        chartData.notCompletedTasks
    ];

    return (
        <div>
            
            <h4>Task Analysis</h4>
            {series.some(value => value > 0) ? (
                <div style={{ overflowX: 'auto', maxWidth: '100%', marginBottom: '20px',marginLeft:'20px' }}>
                    <ReactApexChart
                        options={chartOptions}
                        series={series}
                        type="donut"
                        height={400}
                        width={400}
                    />
                </div>
            ) : (
                <p>Loading chart data...</p>
            )}
        </div>
    );
};



export default GrpTaskChart;




