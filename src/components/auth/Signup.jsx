import React, { useState } from 'react';
import { TextField, Button, Typography, Container, CssBaseline } from '@mui/material';
import { styled } from '@mui/system';
import { auth, firestore } from '../../firebase';
import { setDoc, getDocs, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)({
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledForm = styled('form')({
    width: '100%',
    marginTop: '1em',
});

const StyledButton = styled(Button)({
    margin: '3em 0 2em',
});

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {

            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

            if(email.length < 1)
            {
                setPasswordError(
                    'You must include a valid email.'
                );
                return;
            }

            if (!passwordRegex.test(password)) {
                setPasswordError(
                    'Password must be at least 8 characters long and include one capital letter, one numeric digit, and one special character.'
                );
                return;
            }

            if (password !== confirmPassword) {
                setPasswordError('Passwords do not match.');
                return;
            }

            if (displayName.length < 1) {
                setPasswordError('You must include a name.');
                return;
            }

            setPasswordError('');

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            const userId = userCredential.user.uid;
            await initializeUserData(userId);

            navigate('/login', { state: { showVerificationMessage: true } });

            console.log('Account created successfully');
        } catch (error) {
            // Handle specific error codes
            if (error.code === 'auth/email-already-in-use')
            {
                setPasswordError('Email address is already in use. Please use a different email.');
            }
            else if(error.code === 'auth/invalid-email')
            {
                setPasswordError(
                    'Email is not valid, please try again.'
                );
            }
            else 
            {
                setPasswordError('Error creating account. Please try again.');
            }
            console.error('Error creating account:', error.message);
        }
    };

    const initializeUserData = async (userId) => {
        try {
          await updateProfile(auth.currentUser, {
            displayName: displayName
          })
          console.log('User document created successfully.');
      
          const userTodosCollectionRef = collection(firestore, `users/${userId}/todos`);
          const userTodosQuerySnapshot = await getDocs(userTodosCollectionRef);
      
          if (!userTodosQuerySnapshot.size === 0) {
            await setDoc(userTodosCollectionRef.doc(), {}); // You can add a placeholder document if needed
            console.log('User todos collection created successfully.');
          }
        } catch (error) {
          console.error('Error initializing user data:', error);
        }
      };
      

    return (
        <StyledContainer component="main" maxWidth="xs">
            <CssBaseline />
            <div>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <StyledForm noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="displayName"
                        label="Display Name"
                        name="displayName"
                        autoComplete="displayName"
                        autoFocus
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <StyledButton type="button" fullWidth variant="contained" color="primary" onClick={handleSignup}>
                        Sign Up
                    </StyledButton>
                    {passwordError && (
                        <Typography variant="body2" color="error" align="center">
                            {passwordError}
                        </Typography>
                    )}
                </StyledForm>
            </div>
        </StyledContainer>
    );
};

export default Signup;
