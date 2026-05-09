import { Link, router, usePage } from '@inertiajs/react';
import {
    Avatar,
    Box,
    Chip,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentsIcon from '@mui/icons-material/Payments';
import PublicIcon from '@mui/icons-material/Public';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useState } from 'react';

const SIDEBAR_WIDTH = 260;

const NAV = [
    { label: 'Dashboard', icon: <DashboardIcon />, route: 'admin.dashboard' },
    { label: 'Providers', icon: <StorefrontIcon />, route: 'admin.providers.index' },
];

const NAV_COMING = [
    { label: 'International Rates', icon: <PublicIcon />, soon: true },
];

function SidebarContent({ currentRoute, onLogout }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Brand */}
            <Box sx={{ px: 3, py: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '10px',
                        background: 'linear-gradient(135deg, #0077FF, #00C2FF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <CompareArrowsIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary', lineHeight: 1.1 }}>
                            PadalaHub
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', letterSpacing: 1 }}>
                            ADMIN PORTAL
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider sx={{ mx: 2 }} />

            {/* Nav */}
            <Box sx={{ px: 1.5, pt: 2, flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1.5, px: 1.5, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    Main Menu
                </Typography>
                <List dense sx={{ mt: 0.5 }}>
                    {NAV.map((item) => {
                        const active = currentRoute === item.route;
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={route(item.route)}
                                    sx={{
                                        borderRadius: '10px',
                                        py: 1,
                                        background: active ? '#EEF4FF' : 'transparent',
                                        '&:hover': { background: active ? '#EEF4FF' : '#f5f7fa' },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36, color: active ? '#0077FF' : 'text.secondary' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: active ? 700 : 500,
                                            color: active ? '#0077FF' : 'text.primary',
                                        }}
                                    />
                                    {active && <Box sx={{ width: 4, height: 24, borderRadius: '2px', bgcolor: '#0077FF', mr: -1 }} />}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1.5, px: 1.5, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mt: 2 }}>
                    Coming Soon
                </Typography>
                <List dense sx={{ mt: 0.5 }}>
                    {NAV_COMING.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton disabled sx={{ borderRadius: '10px', py: 1, opacity: 0.45 }}>
                                <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }}
                                />
                                <Chip label="Soon" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#f0f4ff', color: '#0055cc', fontWeight: 700 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{ mx: 2 }} />

            {/* Footer actions */}
            <Box sx={{ px: 1.5, py: 2 }}>
                <ListItemButton
                    component="a"
                    href={route('home')}
                    target="_blank"
                    sx={{ borderRadius: '10px', py: 1, '&:hover': { background: '#f5f7fa' } }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                        <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Site" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary' }} />
                </ListItemButton>

                <ListItemButton
                    onClick={onLogout}
                    sx={{ borderRadius: '10px', py: 1, '&:hover': { background: '#fff0f0' } }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: '#ef4444' }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#ef4444' }} />
                </ListItemButton>
            </Box>
        </Box>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, ziggy } = usePage().props;
    const currentRoute = ziggy?.location ? Object.keys(route().t ?? {}).find(r => route(r) === ziggy.location) : '';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const sidebarSx = {
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: '#ffffff',
            borderRight: '1px solid #eaecf4',
        },
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fb' }}>
            {/* Desktop sidebar */}
            {!isMobile && (
                <Drawer variant="permanent" sx={sidebarSx}>
                    <SidebarContent currentRoute={currentRoute} onLogout={handleLogout} />
                </Drawer>
            )}

            {/* Mobile sidebar */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    sx={sidebarSx}
                >
                    <SidebarContent currentRoute={currentRoute} onLogout={handleLogout} />
                </Drawer>
            )}

            {/* Main content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top bar */}
                <Box sx={{
                    bgcolor: '#fff',
                    borderBottom: '1px solid #eaecf4',
                    px: { xs: 2, md: 4 },
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {isMobile && (
                            <IconButton onClick={() => setMobileOpen(true)} size="small">
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' }}>
                            {title}
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>
                                {auth?.user?.name ?? 'Admin'}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.2 }}>
                                Administrator
                            </Typography>
                        </Box>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#0077FF', fontSize: '0.875rem', fontWeight: 700 }}>
                            {(auth?.user?.name ?? 'A')[0].toUpperCase()}
                        </Avatar>
                    </Stack>
                </Box>

                {/* Page content */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
