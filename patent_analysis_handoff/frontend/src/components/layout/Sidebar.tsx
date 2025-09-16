
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  BatchPrediction as BatchIcon,
  Folder as ProjectsIcon,
  Person as ProfileIcon,
  Science as AgentsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'persistent' | 'temporary';
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Search Patents', icon: <SearchIcon />, path: '/search' },
    { text: 'Projects', icon: <ProjectsIcon />, path: '/projects' },
    { text: 'Batch Processing', icon: <BatchIcon />, path: '/batch' },
    { text: 'AI Agents', icon: <AgentsIcon />, path: '/agents' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        {/* User Info */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.main', borderRadius: 1, color: 'white' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Welcome back!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Secondary Menu */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/profile'}
              onClick={() => handleNavigation('/profile')}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === '/profile' ? 'inherit' : 'text.secondary',
                }}
              >
                <ProfileIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Persona-specific Quick Actions */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Quick Actions
          </Typography>
          {user?.personaType === 'inventor' && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Check Patentability
              • Prior Art Search
            </Typography>
          )}
          {user?.personaType === 'corporate_rd' && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Competitive Analysis
              • Batch Processing
            </Typography>
          )}
          {user?.personaType === 'patent_attorney' && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Legal Review
              • Citation Analysis
            </Typography>
          )}
          {user?.personaType === 'business_strategist' && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Portfolio Analysis
              • Market Intelligence
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
