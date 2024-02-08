import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
// Firestore and auth imports
import { useAuth } from '../../AuthContext';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

const AddTodos = () => {
    const { user } = useAuth();
    const [todoName, setTodoName] = useState('');
    const [todoDescription, setTodoDescription] = useState('');
    const [todoDate, setTodoDate] = useState(null);
    const [validationError, setValidationError] = useState('');

    const handleAddTodo = async () => {
        try {
            // Ensure that user is authenticated
            if (!user) {
                console.error('User not authenticated');
                return;
            }

            // Validate todo name and date
            if (!todoName || !todoDate) {
                setValidationError('*Please fill in both Todo Name and Date');
                return;
            }
            

            // Clear any previous validation error
            setValidationError('');

            // Assuming 'user.uid' is the user's ID
            const userTodosCollection = collection(firestore, 'users', user.uid, 'todos');

            // Generate a new todo document with an auto-generated ID
            await addDoc(userTodosCollection, {
                todoName: todoName,
                todoDescription: todoDescription,
                todoDate: Timestamp.fromDate(new Date(todoDate)),
                completed: false,
                completedDate: null
            });

            // Optionally, you might want to reset the form fields after successfully adding a todo
            setTodoName('');
            setTodoDescription('');
            setTodoDate(null);
            console.log('Todo added successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error adding todo:', error.message);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <h2>Add Todos</h2>
            </Grid>
            <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
                <span style={{ fontSize: '12px' }}>Add</span>
                <IconButton color="primary" onClick={handleAddTodo}>
                    <AddIcon />
                </IconButton>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Todo Name"
                    fullWidth
                    value={todoName}
                    onChange={(e) => setTodoName(e.target.value)}
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Todo Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={todoDescription}
                    onChange={(e) => setTodoDescription(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} style={{ paddingBottom: "5px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Todo Date"
                        value={todoDate}
                        onChange={(newValue) => setTodoDate(newValue)}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
            <span style={{ fontSize: '12px', color: 'red' }}>{validationError}</span>
            </Grid>
        </Grid>
    );
};

export default AddTodos;

