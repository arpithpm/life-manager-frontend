import React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  CheckCircle as TaskIcon,
  Note as NoteIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Life Manager
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.username || "User"}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your life, one task at a time
        </Typography>

        <Grid container spacing={3}>
          {/* Tasks Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TaskIcon
                    sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                  />
                  <Typography variant="h6">Tasks</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Organize and track your daily tasks
                </Typography>
                <Button variant="outlined" fullWidth disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Notes Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <NoteIcon
                    sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
                  />
                  <Typography variant="h6">Notes</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Capture your thoughts and ideas
                </Typography>
                <Button variant="outlined" fullWidth disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Calendar Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon
                    sx={{ fontSize: 40, color: "success.main", mr: 2 }}
                  />
                  <Typography variant="h6">Calendar</Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Plan your schedule and events
                </Typography>
                <Button variant="outlined" fullWidth disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Welcome Message */}
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Welcome to Life Manager! 🎉
          </Typography>
          <Typography variant="body1" paragraph>
            This is your personal dashboard where you can manage all aspects of
            your life. More features are coming soon!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current features in development:
          </Typography>
          <ul>
            <li>Task Management - Create, organize, and track tasks</li>
            <li>Notes - Capture and organize your thoughts</li>
            <li>Calendar - Schedule and plan your time</li>
            <li>Habits - Track daily habits and build routines</li>
            <li>Goals - Set and achieve your long-term goals</li>
          </ul>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;
