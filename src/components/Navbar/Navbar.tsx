// src/components/Navbar/Navbar.tsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Switch,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PaymentIcon from '@mui/icons-material/Payment';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import BuildIcon from '@mui/icons-material/Build';
import ReportIcon from '@mui/icons-material/Report';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useThemeMode from '../../hooks/useTheme';

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Trang Chủ', icon: <HomeIcon />, path: '/' },
    { text: 'Cư Dân', icon: <PeopleIcon />, path: '/residents' },
    { text: 'Căn Hộ', icon: <ApartmentIcon />, path: '/apartments' },
    { text: 'Thanh Toán', icon: <PaymentIcon />, path: '/payments' },
    { text: 'Tòa Nhà', icon: <BusinessIcon />, path: '/buildings' },
    { text: 'Lịch Sử', icon: <HistoryIcon />, path: '/residence-history' },
    { text: 'Sửa Chữa', icon: <BuildIcon />, path: '/repairs' },
    { text: 'Báo Cáo', icon: <ReportIcon />, path: '/reports' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Quản Lý Tòa Nhà
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng Xuất" />
        </ListItem>
        <ListItem>
          <ListItemIcon />
          <ListItemText primary="Chế Độ Tối" />
          <Switch checked={mode === 'dark'} onChange={toggleTheme} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Navbar;
