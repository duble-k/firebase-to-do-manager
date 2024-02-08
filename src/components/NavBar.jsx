import React from "react";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Typography,
    Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
    Home as HomeIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    List as ListIcon,
    TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import "./styles/styles.css";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth"; // Import signOut from Firebase Authentication


const NavBar = () => {

    const location = useLocation();
    const { user, setUser } = useAuth();

    // Function to handle user logout
    const handleLogout = async () => {
        try {
            // Sign out the user
            console.log(user.auth);
            await signOut(user.auth); // Assuming you have access to the auth instance in user object
            setUser(null); // Update the local state to reflect the user being logged out
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <AssignmentIcon sx={{ fontSize: 30, marginRight: 1 }} />
                <Typography variant="h6">My Todos</Typography>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ mx: 2, backgroundColor: "white" }}
                />

                <IconButton
                    className={location.pathname === "/" ? "active-button" : ""}
                    edge="start"
                    component={Link}
                    to="/"
                    color="inherit"
                    aria-label="home"
                >
                    <HomeIcon />
                </IconButton>

                {user?.emailVerified && (
                    <>
                        <Button
                            className={location.pathname === "/metrics" ? "active-button" : ""}
                            color="inherit"
                            component={Link}
                            to="/metrics"
                        >
                            <TrendingUpIcon />
                            Metrics
                        </Button>
                        {user?.emailVerified && (
                            <Button
                                className={
                                    location.pathname === "/todos" ? "active-button" : ""
                                }
                                color="inherit"
                                component={Link}
                                to="/todos"
                            >
                                <ListIcon />
                                Todos
                            </Button>
                        )}
                    </>
                )}

                <div style={{ flexGrow: 1 }}></div>
                <Button
                    className={location.pathname === "/login" ? "active-button" : ""}
                    color="inherit"
                    component={Link}
                    to="/login"
                    onClick={user?.emailVerified ? handleLogout : undefined} // Call handleLogout only if the user is logged in
                >
                    <PersonIcon />
                    {user?.emailVerified ? "Logout" : "Login"}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
