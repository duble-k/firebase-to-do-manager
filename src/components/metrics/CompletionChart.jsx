import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from "chart.js";
import { useAuth } from '../../AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

const CompletionChart = () => {
    const { user } = useAuth();
    const [completionData, setCompletionData] = useState(null);
    const [totalTodos, setTotalTodos] = useState(0);
    const [compCount, setCompCount] = useState(0);
    Chart.register(...registerables);

    useEffect(() => {
        const fetchCompletionData = async () => {
            try {
                // Ensure that user is authenticated
                if (!user) {
                    console.error('User not authenticated');
                    return;
                }

                // Reference to the 'todos' subcollection under the user document
                const userTodosCollection = collection(firestore, 'users', user.uid, 'todos');
                const currentDate = new Date();
                const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
                // Set time to the start of the day for the start date
                startOfCurrentMonth.setHours(0, 0, 0, 0);
        
                // Set time to the end of the day for the end date
                endOfCurrentMonth.setHours(23, 59, 59, 999);

                const completedMonthQuery = query(
                    userTodosCollection,
                    where('completed', '==', true),
                    where('todoDate', '>=', startOfCurrentMonth),
                    where('todoDate', '<=', endOfCurrentMonth)
                );

                const completedMonthSnapshot = await getDocs(completedMonthQuery);
                const completedCount = completedMonthSnapshot.size;
                setCompCount(completedCount);

                const incompleteMonthQuery = query(
                    userTodosCollection,
                    where('completed', '==', false),
                    where('todoDate', '>=', startOfCurrentMonth),
                    where('todoDate', '<=', endOfCurrentMonth)
                );

                const incompleteMonthSnapshot = await getDocs(incompleteMonthQuery);
                const incompleteCount = incompleteMonthSnapshot.size;

                // Set data for the chart
                setCompletionData({
                    labels: ['Completed', 'Incomplete'],
                    datasets: [
                        {
                            label: '',
                            backgroundColor: ['#36A2EB', '#FF6384'],
                            borderColor: ['#36A2EB', '#FF6384'],
                            borderWidth: 1,
                            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
                            hoverBorderColor: ['#36A2EB', '#FF6384'],
                            data: [completedCount, incompleteCount],
                        },
                    ],
                });
                setTotalTodos(incompleteCount + completedCount);
            } catch (error) {
                console.error('Error fetching completion data:', error.message);
            }
        };

        // Fetch completion data when the component mounts
        fetchCompletionData();
    }, [user]);

    const chartOptions = {
        plugins:
        {
            legend: {
                display: false, // Hide legend
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0, // Set precision to 0 for integers
                },
                max: totalTodos,
            },
        },
    };


    return completionData?.datasets[0].data[0] > 0 || completionData?.datasets[0].data[1] > 0 ? (
        <>
            <h2>Progression Bar Chart</h2>
            <Bar
                data={completionData}
                options={chartOptions}
            />
            <span style={{ textAlign: 'center' }}>
                {compCount !== 0 && (
                    <div>
                        {compCount / totalTodos > 0.5 ? (
                            <Typography>
                                <span style={{ color: 'green' }}>You're On Track- Keep Going!</span>
                            </Typography>
                        ) : (
                            <Typography>
                                <span style={{ color: 'orange' }}>Believe In Yourself- Keep Ticking Off Tasks One by One!</span>
                            </Typography>
                        )}
                    </div>
                )}
            </span>
        </>
    ) : (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <Typography variant="h6" color="textSecondary">
                No Todo(s) available
            </Typography>
        </div>
    );
};

export default CompletionChart;

