import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AddTodos from './todo-views/AddTodos';
import TodoMetrics from './todo-views/TodoMetrics';
import TodoAccordions from './todo-views/TodosAccordian';
import { useAuth } from '../AuthContext';

const TodoMain = () => {
    const { user } = useAuth();

    return (
        <Grid container spacing={2} style={{ marginTop: '50px' }}>
            {/* Section 1 and 2 */}
            <Grid item xs={5} container spacing={2} style={{ paddingTop: '0px' }}>
                {/* Section 1 */}
                <Grid item xs={12}>
                    <Paper style={{ background: '#f0f0f0' }}>
                        <TodoMetrics />
                    </Paper>
                </Grid>

                {/* Section 2 */}
                <Grid item xs={12}>
                    <Paper style={{ background: '#f0f0f0' }}>
                        <AddTodos />
                    </Paper>
                </Grid>
            </Grid>

            {/* Section 3 */}
            <Grid item xs={7}>
                <h2>{user?.displayName}'s Todo(s)...</h2>
                <Paper>
                    <TodoAccordions />
                </Paper>
            </Grid>
        </Grid>
    );
};

export default TodoMain;
