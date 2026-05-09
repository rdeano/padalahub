import { Head, Link } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminLayout from '@/Layouts/AdminLayout';

function StatCard({ icon, label, value, sub, color = '#0077FF' }) {
    return (
        <Paper elevation={0} sx={{ p: 3.5, border: '1px solid #eaecf4', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.72rem', mb: 1.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 1 }}>
                        {value}
                    </Typography>
                    {sub && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {sub}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    width: 48, height: 48, borderRadius: '14px',
                    bgcolor: color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                </Box>
            </Stack>
        </Paper>
    );
}

export default function Dashboard({ stats, providers, recentLogs }) {
    const lastUpdated = stats.last_updated
        ? new Date(stats.last_updated).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
        : 'Never';

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin — Dashboard" />

            {/* Welcome banner */}
            <Box sx={{
                background: '#EEF4FF',
                border: '1px solid #d4e2ff',
                borderRadius: '20px',
                p: { xs: 3, md: 4 },
                mb: 4,
            }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Welcome back 👋
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.95rem' }}>
                    Here's what's happening with PadalaHub today.
                </Typography>
            </Box>

            {/* Stat cards */}
            <Grid container spacing={3} sx={{mb:4}}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<StorefrontIcon />}
                        label="Total Providers"
                        value={stats.total_providers}
                        sub={`${stats.domestic_count} domestic`}
                        color="#0077FF"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<CheckCircleIcon />}
                        label="Active Providers"
                        value={stats.active_providers}
                        sub={`${stats.total_providers - stats.active_providers} inactive`}
                        color="#00C48C"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<PaymentsIcon />}
                        label="Fee Tiers"
                        value={stats.total_fee_tiers}
                        sub="Domestic fee records"
                        color="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<ScheduleIcon />}
                        label="Last Updated"
                        value={lastUpdated}
                        sub="Fee table update"
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Providers table */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ border: '1px solid #eaecf4', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{px:3 , py:3}}>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Providers Overview</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>All registered providers</Typography>
                            </Box>
                            <Button
                                component={Link}
                                href={route('admin.providers.index')}
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                sx={{ borderRadius: 8 }}
                            >
                                Manage
                            </Button>
                        </Stack>
                        <Divider />
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#fafafa' }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.75 }}>Provider</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Type</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Fee Tiers</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {providers.map((p) => (
                                    <TableRow key={p.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafbff' } }}>
                                        <TableCell sx={{ py: 2 }}>
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <Box sx={{
                                                    width: 36, height: 36, borderRadius: '10px',
                                                    bgcolor: '#0077FF18',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.72rem', fontWeight: 800, color: '#0077FF', flexShrink: 0,
                                                }}>
                                                    {p.name.slice(0, 2).toUpperCase()}
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.name}</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{p.slug}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={p.type}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem', fontWeight: 700, height: 22,
                                                    bgcolor: p.type === 'domestic' ? '#f0f4ff' : '#fff7ed',
                                                    color: p.type === 'domestic' ? '#0055cc' : '#c2410c',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.fee_tiers_count}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={p.is_active ? 'Active' : 'Inactive'}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.7rem', fontWeight: 700, height: 22,
                                                    bgcolor: p.is_active ? '#e6faf4' : '#fef2f2',
                                                    color: p.is_active ? '#00956a' : '#dc2626',
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>

                {/* Quick actions + Activity */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                        {/* Quick actions */}
                        <Paper elevation={0} sx={{ border: '1px solid #eaecf4', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Quick Actions</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Jump to a management page</Typography>
                            <Stack spacing={1.5}>
                                <Button
                                    component={Link}
                                    href={route('admin.providers.index')}
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<StorefrontIcon />}
                                    sx={{ justifyContent: 'flex-start', borderRadius: '10px', borderColor: '#e2e8f0', color: 'text.primary', '&:hover': { borderColor: '#0077FF', bgcolor: '#f0f7ff' } }}
                                >
                                    Manage Providers
                                </Button>
                                {providers.filter(p => p.type === 'domestic').map(p => (
                                    <Button
                                        key={p.id}
                                        component={Link}
                                        href={route('admin.rates.domestic', p.id)}
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<PaymentsIcon />}
                                        sx={{ justifyContent: 'flex-start', borderRadius: '10px', borderColor: '#e2e8f0', color: 'text.primary', fontSize: '0.8rem', '&:hover': { borderColor: '#0077FF', bgcolor: '#f0f7ff' } }}
                                    >
                                        {p.name} Fees
                                    </Button>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Activity log */}
                        <Paper elevation={0} sx={{ border: '1px solid #eaecf4', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', p: 3.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Recent Activity</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Latest rate update logs</Typography>
                            {recentLogs.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3, bgcolor: '#fafafa', borderRadius: '12px' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>No activity yet.</Typography>
                                </Box>
                            ) : (
                                <Stack spacing={2}>
                                    {recentLogs.map((log) => (
                                        <Stack key={log.id} direction="row" spacing={2} alignItems="center">
                                            <Box sx={{
                                                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                                                bgcolor: log.status === 'success' ? '#00C48C' : '#ef4444',
                                            }} />
                                            <Box flex={1}>
                                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.3 }}>{log.provider?.name}</Typography>
                                                <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.25 }}>
                                                    {log.type} · {log.status}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </AdminLayout>
    );
}
