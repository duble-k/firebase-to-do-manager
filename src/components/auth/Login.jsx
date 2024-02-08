import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { TextField, Button, IconButton, Typography, Container, CssBaseline } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../AuthContext';
import ListIcon from '@mui/icons-material/List';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { signOut } from "firebase/auth";

const StyledContainer = styled(Container)({
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledForm = styled('form')({
    width: '100%', // Fix IE 11 issue.
    marginTop: '1em',
});

const StyledButton = styled(Button)({
    margin: '3em 0 2em',
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user, setUser } = useAuth();
    const [open, setOpen] = useState(false);

    const location = useLocation(); // Access the location object

    useEffect(() => {
        // Check if showVerificationMessage is true in the location state
        if (location.state?.showVerificationMessage) {
            setOpen(true);
            location.state.showVerificationMessage = false;
        }
    }, [location.state]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            handleLogin();
        }
    };

    const handleLogin = async () => {
        if (email.length < 1 || password.length < 1) {
            setErrorMessage("Username and Password Required");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user.emailVerified) {
                setUser(userCredential.user);
                setErrorMessage('');
                console.log('Logged in successfully: ', userCredential.user);
            } else {
                await signOut(user.auth);
                setErrorMessage("You must verify your account before logging in.")
                console.log('Email not verified. Please verify your email to log in.');
                // Optionally, you can display a message to the user indicating that they need to verify their email.
            }
        } catch (error) {
            if (error.code === "auth/invalid-email" || error.code === "auth/invalid-credential") {
                setErrorMessage("Invalid Email or Password.");
            }
            else {
                setErrorMessage("Error logging in. Please check console for more info.");
            }
            console.error(error.code);
        }
    };

    const handleCloseBanner = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        location.state = null;

        setOpen(false);
    };

    return (
        <StyledContainer component="main" maxWidth="xs">

            <Snackbar
                open={open}
                autoHideDuration={6000} // Adjust the duration as needed
                onClose={handleCloseBanner}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseBanner}
                    severity="success" // 'success' or 'error'
                >
                    'Signup successful! Check your email for verification.'
                </MuiAlert>
            </Snackbar>
            <CssBaseline />
            <div>
                {user?.emailVerified ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Welcome to your Todos, {user?.displayName}!
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Start organizing your tasks and stay productive with our Todo application.
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
                            View Todos
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <StyledForm noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown} // Add key down event handler
                            />
                            <StyledButton
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleLogin}
                            >
                                Login
                            </StyledButton>
                        </StyledForm>
                        <Link to="/signup">
                            <span style={{ fontSize: '15px' }}>Don't have an account yet? Sign Up Now</span>
                            <IconButton size="small">
                                <AssignmentIndIcon fontSize="small" />
                            </IconButton>
                        </Link>
                        {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                        )}
                    </>
                )}
            </div>
        </StyledContainer>
    );
};

export default Login;
