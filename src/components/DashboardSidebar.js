import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  Folder as CategoryIcon,
  ShoppingCart as OrderIcon,
  FileText as ReportIcon
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    href: '/management/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/management/user',
    icon: UsersIcon,
    title: 'Users'
  },
  {
    href: '/management/category',
    icon: CategoryIcon,
    title: 'Categories'
  },
  {
    href: '/management/product',
    icon: ShoppingBagIcon,
    title: 'Products'
  },
  {
    href: '/management/order',
    icon: OrderIcon,
    title: 'Orders'
  },
  {
    href: '/report/order',
    icon: ReportIcon,
    title: 'Sale Reports'
  },
  {
    href: '/management/account',
    icon: UserIcon,
    title: 'Account'
  },
  {
    href: '/management/setting',
    icon: SettingsIcon,
    title: 'Settings'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={user.avatar ? user.avatar : '/static/images/avatars/avatar_6.png'}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64
          }}
          to="/management/account"
        />
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {user.fullName}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default DashboardSidebar;
