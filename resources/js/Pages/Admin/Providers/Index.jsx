import { Head, Link, router } from '@inertiajs/react';
import {
    Box, Button, Chip, Dialog, DialogContent, DialogTitle,
    Divider, FormControl, FormControlLabel, IconButton, InputLabel,
    MenuItem, Paper, Select, Stack, Switch, Table, TableBody,
    TableCell, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const REGION_LABEL = { ncr_luzon: 'NCR / Luzon', visayas_mindanao: 'Visayas / Mindanao' };

const EMPTY_FORM = {
    name: '',
    slug: '',
    type: 'domestic',
    affiliate_url: '',
    requires_account: false,
    has_affiliate: false,
    is_nationwide: false,
    is_active: true,
};

function slugify(str) {
    return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function ProvidersIndex({ providers }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const toggleActive = (provider) => {
        router.patch(route('admin.providers.update', provider.id), {
            name: provider.name,
            affiliate_url: provider.affiliate_url,
            is_active: !provider.is_active,
        }, { preserveScroll: true });
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setForm(f => ({ ...f, name, slug: slugify(name) }));
        setErrors(err => ({ ...err, name: undefined, slug: undefined }));
    };

    const handleClose = () => {
        setOpen(false);
        setForm(EMPTY_FORM);
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post(route('admin.providers.store'), form, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); handleClose(); },
            onError: (errs) => { setSaving(false); setErrors(errs); },
        });
    };

    const activeCount = providers.filter(p => p.is_active).length;

    return (
        <AdminLayout title="Providers">
            <Head title="Admin — Providers" />

            {/* Page header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2} sx={{mb:4}}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25 }}>
                        Providers
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {providers.length} registered · {activeCount} active
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: '12px', px: 2.5, alignSelf: { xs: 'flex-start', sm: 'auto' } }}
                >
                    Add Provider
                </Button>
            </Stack>

            {/* Providers table */}
            <Paper elevation={0} sx={{ border: '1px solid #eaecf4', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                            {['Provider', 'Type', 'Coverage', 'Fee Tiers', 'Status', 'Actions'].map(h => (
                                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, py: 2 }}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {providers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center' }}>
                                    <StorefrontIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>No providers yet. Add one to get started.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {providers.map((p) => (
                            <TableRow key={p.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafbff' } }}>
                                <TableCell sx={{ py: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Box sx={{
                                            width: 38, height: 38, borderRadius: '11px',
                                            bgcolor: '#0077FF18',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.72rem', fontWeight: 800, color: '#0077FF', flexShrink: 0,
                                        }}>
                                            {p.name.slice(0, 2).toUpperCase()}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3 }}>{p.name}</Typography>
                                            <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', fontFamily: 'monospace' }}>{p.slug}</Typography>
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
                                <TableCell>
                                    {p.is_nationwide ? (
                                        <Chip label="Nationwide" size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 700 }} />
                                    ) : p.regions.length === 0 ? (
                                        <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>—</Typography>
                                    ) : (
                                        <Stack spacing={0.5}>
                                            {p.regions.map(r => (
                                                <Typography key={r.id} sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                    {REGION_LABEL[r.region] ?? r.region}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                        {p.fee_tiers_count > 0 ? p.fee_tiers_count : <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>—</Typography>}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Switch
                                            checked={p.is_active}
                                            onChange={() => toggleActive(p)}
                                            size="small"
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#00C48C' },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00C48C' },
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: p.is_active ? '#00956a' : 'text.disabled' }}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {p.type === 'domestic' && (
                                        <Tooltip title="Edit fee tiers">
                                            <Button
                                                component={Link}
                                                href={route('admin.rates.domestic', p.id)}
                                                size="small"
                                                variant="outlined"
                                                startIcon={<EditIcon />}
                                                sx={{ borderRadius: '8px', borderColor: '#e2e8f0', color: 'text.primary', fontSize: '0.78rem', '&:hover': { borderColor: '#0077FF', bgcolor: '#f0f7ff' } }}
                                            >
                                                Fee Tiers
                                            </Button>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Add Provider Modal */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
                <DialogTitle sx={{ px: 3, pt: 3, pb: 0 }}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Add Provider</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Add a new remittance provider to compare</Typography>
                        </Box>
                        <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary', mt: -0.5 }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent sx={{ px: 3, pt: 2.5, pb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Provider Name"
                                value={form.name}
                                onChange={handleNameChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                                autoFocus
                                placeholder="e.g. Palawan Express"
                            />

                            <TextField
                                label="Slug"
                                value={form.slug}
                                onChange={(e) => { setForm(f => ({ ...f, slug: e.target.value })); setErrors(err => ({ ...err, slug: undefined })); }}
                                error={!!errors.slug}
                                helperText={errors.slug || 'Auto-generated from name. Used in URLs.'}
                                fullWidth
                                placeholder="e.g. palawan"
                            />

                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={form.type}
                                    label="Type"
                                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                                >
                                    <MenuItem value="domestic">Domestic</MenuItem>
                                    <MenuItem value="international">International</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Affiliate URL (optional)"
                                value={form.affiliate_url}
                                onChange={(e) => setForm(f => ({ ...f, affiliate_url: e.target.value }))}
                                error={!!errors.affiliate_url}
                                helperText={errors.affiliate_url || 'Leave blank for domestic walk-in providers.'}
                                fullWidth
                                placeholder="https://wise.com?ref=yourcode"
                            />

                            <Box sx={{ border: '1px solid #eaecf4', borderRadius: '12px', p: 2 }}>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Options
                                </Typography>
                                <Stack spacing={0.5}>
                                    <FormControlLabel
                                        control={<Switch size="small" checked={form.is_active} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} />}
                                        label={<Typography sx={{ fontSize: '0.875rem' }}>Active (visible to users)</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={form.is_nationwide} onChange={(e) => setForm(f => ({ ...f, is_nationwide: e.target.checked }))} />}
                                        label={<Typography sx={{ fontSize: '0.875rem' }}>Nationwide (skip region filter)</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={form.requires_account} onChange={(e) => setForm(f => ({ ...f, requires_account: e.target.checked }))} />}
                                        label={<Typography sx={{ fontSize: '0.875rem' }}>Requires account (show badge)</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch size="small" checked={form.has_affiliate} onChange={(e) => setForm(f => ({ ...f, has_affiliate: e.target.checked }))} />}
                                        label={<Typography sx={{ fontSize: '0.875rem' }}>Has affiliate program</Typography>}
                                    />
                                </Stack>
                            </Box>

                            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                                <Button onClick={handleClose} sx={{ borderRadius: '10px' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={saving} sx={{ borderRadius: '10px', px: 3 }}>
                                    {saving ? 'Saving…' : 'Add Provider'}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
