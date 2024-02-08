import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete'
import { Paper, Typography } from '@mui/material';
import { useAuth } from '../../AuthContext';
import { doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

const Todos = ({ todos }) => {
    const { user } = useAuth();
    const [upcomingTodos, setUpcomingTodos] = useState([]);

    useEffect(() => {
        // Update local state with the provided todos
        setUpcomingTodos(todos);
    }, [todos]);

    const isPastDueDate = (dueDate) => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        return dueDate.toDate().setHours(0, 0, 0, 0) < currentDate;
    };

    const handleTodoComplete = async (todoId) => {
        try {
            // Update the 'completed' field to true in Firestore
            const todoDocRef = doc(firestore, 'users', user.uid, 'todos', todoId);
            await updateDoc(todoDocRef, { completed: true, completedDate: Timestamp.fromDate(new Date()) });

            // Remove the completed todo from the local state
            setUpcomingTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
            // TODO: stop brute forcing and use redux or content
            window.location.reload();
        } catch (error) {
            console.error('Error marking todo as completed:', error.message);
        }
    };

    const handleTodoDelte = async (todoId) => {
        // delete 
        await deleteDoc(doc(firestore, `users/${user.uid}/todos/${todoId}`));
        // Remove the completed todo from the local state
        setUpcomingTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
        // TODO: stop brute forcing and use redux or content
        window.location.reload();
    }

    return (todos.length > 0 ? (
        <Paper elevation={3} style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Complete Todo</TableCell>
                            <TableCell>Delete Todo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {upcomingTodos.map((todo) => (
                            <TableRow key={todo.id}>
                                <TableCell>{todo.todoName}</TableCell>
                                <TableCell>{todo.todoDescription}</TableCell>
                                <TableCell>{todo.todoDate.toDate().toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={false} // You can customize this based on todo.completed
                                        onChange={() => handleTodoComplete(todo.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => handleTodoDelte(todo.id)}
                                        aria-label="delete"
                                        style={{ color: 'red' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                                {isPastDueDate(todo.todoDate) && (
                                    <TableCell>
                                        <Typography variant="body2" color="error">
                                            Past Due
                                        </Typography>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    ) : (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
            <Typography variant="h6" color="textSecondary">
                No Todo(s) available
            </Typography>
        </div>
    )
    );
};

export default Todos;
