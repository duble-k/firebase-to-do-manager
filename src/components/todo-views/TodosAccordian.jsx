import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Todos from './Todos'; // Make sure to adjust the import path

// You may need to adjust these imports based on your project structure
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../AuthContext';

const TodoAccordions = () => {
    const { user } = useAuth();
    const [todayTodos, setTodayTodos] = useState([]);
    const [thisWeekTodos, setThisWeekTodos] = useState([]);
    const [allOtherTodos, setAllOtherTodos] = useState([]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                // Ensure that user is authenticated
                if (!user) {
                    console.error('User not authenticated');
                    return;
                }

                // Query Parameters
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);

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
                // Queries
                // Fetch today's todos
                const todayQuery = query(
                    userTodosCollection,
                    where('todoDate', '>=', startOfDay),
                    where('todoDate', '<=', endOfDay),
                    where('completed', '==', false)
                );
                const todaySnapshot = await getDocs(todayQuery);
                const todayTodos = todaySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTodayTodos(todayTodos);

                const thisWeekQuery = query(
                    userTodosCollection,
                    where('todoDate', '>=', startOfWeek),
                    where('todoDate', '<=', endOfWeek),
                    where('completed', '==', false)
                );
                const thisWeekSnapshot = await getDocs(thisWeekQuery);
                const thisWeekTodos = thisWeekSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setThisWeekTodos(thisWeekTodos);

                const beforeTodayQuery = query(
                    userTodosCollection,
                    where('todoDate', '<', startOfWeek),
                    where('completed', '==', false)
                );

                const afterEndOfWeekQuery = query(
                    userTodosCollection,
                    where('todoDate', '>', endOfWeek),
                    where('completed', '==', false)
                );
                // Fetch all documents from both queries
                const beforeTodayTodos = (await getDocs(beforeTodayQuery)).docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const afterEndOfWeekTodos = (await getDocs(afterEndOfWeekQuery)).docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Combine the results in your application code
                const allOtherTodos = [...beforeTodayTodos, ...afterEndOfWeekTodos];
                setAllOtherTodos(allOtherTodos);
            } catch (error) {
                console.error('Error fetching todos:', error.message);
            }
        };

        // Fetch todos when the component mounts
        fetchTodos();
    }, [user]);

    return (
        <div>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Today</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Todos todos={todayTodos} />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">This Week</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Todos todos={thisWeekTodos} />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">All Other</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Todos todos={allOtherTodos} />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default TodoAccordions;
