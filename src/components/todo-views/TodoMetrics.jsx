import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { IconButton, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import ListAltIcon from '@mui/icons-material/ListAlt';

const TodoMetrics = () => {
    const { user } = useAuth();
    const [totalTodos, setTotalTodos] = useState(0);
    const [completedTodos, setCompletedTodos] = useState(0);

    useEffect(() => {
        const fetchTodoMetrics = async () => {
            try {
                // Ensure that user is authenticated
                if (!user) {
                    console.error('User not authenticated');
                    return;
                }

                // Determine the current date
                const currentDate = new Date();

                // Calculate the difference between the current day of the week and Monday (considering Sunday as 0)
                const daysUntilMonday = (currentDate.getDay() + 6) % 7;

                // Calculate the start of the current week (Monday at 12:00:00 am)
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - daysUntilMonday);
                startOfWeek.setHours(0, 0, 0, 0);

                // Calculate the end of the current week (Sunday at 11:59:59 pm)
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                // Reference to the 'todos' subcollection under the user document
                const userTodosCollection = collection(firestore, 'users', user.uid, 'todos');

                const thisWeekQuery = query(
                    userTodosCollection,
                    where('todoDate', '>=', startOfWeek),
                    where('todoDate', '<=', endOfWeek),
                );

                // Get the todos for the current week
                const querySnapshot = await getDocs(thisWeekQuery);

                // Calculate metrics
                const totalTodosCount = querySnapshot.size;
                const completedTodosCount = querySnapshot.docs.filter((doc) => doc.data().completed).length;

                // Update state with the metrics
                setTotalTodos(totalTodosCount);
                setCompletedTodos(completedTodosCount);
            } catch (error) {
                console.error('Error fetching todo metrics:', error.message);
            }
        };

        // Fetch todo metrics when the component mounts
        fetchTodoMetrics();
    }, [user]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <div>
                    <h2>Metrics This Current Week</h2>
                </div>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
                <Link to="/metrics" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '12px' }}>View Current Month</span>
                    <IconButton size="small">
                        <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                </Link>
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ListAltIcon style={{ marginRight: '8px' }} /> {/* Icon for Total Todos */}
                    <Typography>Total Todos: {totalTodos}</Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon style={{ marginRight: '8px', color: 'green' }} /> {/* Icon for Completed Todos */}
                    <Typography>Completed Todos: {completedTodos}</Typography>
                </div>
            </Grid>
        </Grid>
    );
};

export default TodoMetrics;
