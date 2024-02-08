import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useAuth } from '../../AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../firebase';

const CompareTodos = () => {
  const { user } = useAuth();
  const [incompleteTodos, setIncompleteTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        // Ensure that user is authenticated
        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const currentDate = new Date();
        const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Set time to the start of the day for the start date
        startOfCurrentMonth.setHours(0, 0, 0, 0);

        // Set time to the end of the day for the end date
        endOfCurrentMonth.setHours(23, 59, 59, 999);


        // Reference to the 'todos' subcollection under the user document
        const userTodosCollection = collection(firestore, 'users', user.uid, 'todos');

        // Query completed todos from the previous month
        const currentCompletedMonthQuery = query(
          userTodosCollection,
          where('completed', '==', true),
          where('todoDate', '>=', startOfCurrentMonth),
          where('todoDate', '<=', endOfCurrentMonth)
        );

        // Query completed todos from the previous month
        const currentIncompleteMonthQuery = query(
          userTodosCollection,
          where('completed', '==', false),
          where('todoDate', '>=', startOfCurrentMonth),
          where('todoDate', '<=', endOfCurrentMonth)
        );
        // Get the completed todos
        const currentCompletedMonthSnapshot = await getDocs(currentCompletedMonthQuery);
        const currentCompletedMonthTodos = currentCompletedMonthSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Get the incomplete todos
        const currentIncompleteMonthSnapshot = await getDocs(currentIncompleteMonthQuery);
        const currentIncompleteMonthTodos = currentIncompleteMonthSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Update state with the completed todos from the past month
        setCompletedTodos(currentCompletedMonthTodos);

        // Update state with the incomplete todos from the past month
        setIncompleteTodos(currentIncompleteMonthTodos);
      } catch (error) {
        console.error('Error fetching completed todos:', error.message);
      }
    };

    // Fetch completed todos when the component mounts
    fetchCompletedTodos();
  }, [user]);

  return (completedTodos.length > 0 || incompleteTodos.length > 0 ? (
    <>
      {completedTodos.length > 0 &&
        <>
          <h2>Current Month's Completed Todos</h2>
          <Paper style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Completion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedTodos.map((todo) => (
                    <TableRow key={todo.id}>
                      <TableCell>{todo.todoName}</TableCell>
                      <TableCell>{todo.todoDescription}</TableCell>
                      <TableCell>{todo.todoDate.toDate().toLocaleDateString()}</TableCell>
                      <TableCell>
                        {todo.completedDate && todo.completedDate.toDate().setHours(0, 0, 0, 0) <= todo.todoDate.toDate().setHours(0, 0, 0, 0) ? (
                          <span style={{ color: 'green' }}>On Time</span>
                        ) : (
                          <span style={{ color: 'red' }}>Past Due</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      }
      {incompleteTodos.length > 0 &&
        <>
          <h2>Current Month's Incomplete Todos</h2>
          <Paper style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incompleteTodos.map((todo) => (
                    <TableRow key={todo.id}>
                      <TableCell>{todo.todoName}</TableCell>
                      <TableCell>{todo.todoDescription}</TableCell>
                      <TableCell>{todo.todoDate.toDate().toLocaleDateString()}</TableCell>
                      <TableCell>
                        {new Date() <= todo.todoDate.toDate().setHours(23, 59, 59, 999) ? (
                          <span style={{ color: 'green' }}>Not Due Yet</span>
                        ) : (
                          <span style={{ color: 'red' }}>Past Due</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      }
    </>
  ) : (
    <div style={{ textAlign: 'center', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
      <Typography variant="h6" color="textSecondary">
        No Todo(s) available
      </Typography>
    </div>
  )

  );
};

export default CompareTodos;
