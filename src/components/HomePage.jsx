import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ListIcon from '@mui/icons-material/List';
import { useAuth } from '../AuthContext'

const HomePage = () => {

    const { user } = useAuth();
    return (
        <Container component="main" maxWidth="xs" style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h4" style={{ marginBottom: '20px' }}>
                {user ? user.displayName + "'s" : "Your"} Todo Manager
            </Typography>
            <Button
                component={Link}
                to={user ? "/todos" : "/login"}
                variant="outlined"
                color="primary"
                size="large"
                style={{ marginTop: '10px', marginBottom: '20px' }}
                startIcon={<ListIcon />}
            >
                View My Todos
            </Button>
        </Container>
    );
};

export default HomePage;
