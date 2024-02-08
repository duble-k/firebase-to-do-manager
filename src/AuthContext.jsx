// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Import your firebase configuration
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
        });

        return () => unsubscribe();
    }, []);

    const contextValue = {
        user,
        setUser, // Function to set the user
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
