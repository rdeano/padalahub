import { Head, Link, router } from '@inertiajs/react';
import {
    Box, Button, Chip, Divider, InputAdornment,
    Paper, Stack, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const REGION_LABEL = { ncr_luzon: 'NCR / Luzon', visayas_mindanao: 'Visayas / Mindanao', nationwide: 'Nationwide' };
const REGION_COLOR = { ncr_luzon: { bg: '#f0f4ff', color: '#0055cc' }, visayas_mindanao: { bg: '#fff7ed', color: '#c2410c' }, nationwide: { bg: '#f0fdf4', color: '#15803d' } };

export default function DomesticRates({ provider, tiers }) {
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const startEdit = (tier) => {
        setEditing(tier.id);
        setForm({ fee: tier.fee, discount: tier.discount, effective_date: tier.effective_date });
    };

    const save = (tierId) => {
        setSaving(true);
        router.patch(route('admin.rates.update', tierId), form, {
            preserveScroll: true,
            onSuccess: () => { setEditing(null); setSaving(false); },
            onError: () => setSaving(false),
        });
    };

    const grouped = tiers.reduce((acc, t) => {
        (acc[t.region] = acc[t.region] ?? []).push(t);
        return acc;
    }, {});

    return (
        <AdminLayout title={`${provider.name} — Fee Tiers`}>
            <Head title={`Admin — ${provider.name} Fees`} />

            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Button component={Link} href={route('admin.providers.index')} startIcon={<ArrowBackIcon />} size="small" sx={{ borderRadius: '8px', borderColor: '#e2e8f0', color: 'text.secondary' }} variant="outlined">
                    Back
                </Button>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{provider.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tiers.length} fee tiers · Last updated: {tiers[0]?.effective_date ?? '—'}</Typography>
                </Box>
            </Stack>

            <Stack spacing={3}>
                {Object.entries(grouped).map(([region, regionTiers]) => {
                    const rc = REGION_COLOR[region] ?? { bg: '#f5f5f5', color: '#555' };
                    return (
                        <Paper key={region} elevation={0} sx={{ border: '1px solid #eaecf4', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                            <Stack direction="row" alignItems="center" spacing={2} px={3} py={2}>
                                <Chip label={REGION_LABEL[region]} size="small" sx={{ bgcolor: rc.bg, color: rc.color, fontWeight: 700, fontSize: '0.75rem' }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{regionTiers.length} tiers</Typography>
                            </Stack>
                            <Divider />
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                                        {['Amount Range', 'Fee (₱)', 'Discount (₱)', 'Net Fee (₱)', 'Effective Date', ''].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, py: 1.5 }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {regionTiers.map((tier) => {
                                        const isEditing = editing === tier.id;
                                        const netFee = isEditing ? (Number(form.fee) - Number(form.discount)) : tier.net_fee;

                                        return (
                                            <TableRow key={tier.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#fafbff' }, bgcolor: isEditing ? '#f0f7ff' : 'inherit' }}>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                                        ₱{Number(tier.amount_from).toLocaleString()} — ₱{Number(tier.amount_to).toLocaleString()}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {isEditing ? (
                                                        <TextField size="small" type="number" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })}
                                                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                                                            sx={{ width: 110 }} />
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>₱{tier.fee}</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {isEditing ? (
                                                        <TextField size="small" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })}
                                                            InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                                                            sx={{ width: 110 }} />
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.875rem', color: tier.discount > 0 ? '#00956a' : 'text.secondary' }}>
                                                            {tier.discount > 0 ? `-₱${tier.discount}` : '—'}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: isEditing ? '#0077FF' : 'text.primary' }}>
                                                        ₱{netFee}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    {isEditing ? (
                                                        <TextField size="small" type="date" value={form.effective_date} onChange={e => setForm({ ...form, effective_date: e.target.value })} sx={{ width: 150 }} />
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{tier.effective_date}</Typography>
                                                    )}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {isEditing ? (
                                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                            <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={() => save(tier.id)} disabled={saving} sx={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                                                                Save
                                                            </Button>
                                                            <Button size="small" startIcon={<CloseIcon />} onClick={() => setEditing(null)} sx={{ borderRadius: '8px', fontSize: '0.75rem' }}>
                                                                Cancel
                                                            </Button>
                                                        </Stack>
                                                    ) : (
                                                        <Button size="small" startIcon={<EditIcon />} onClick={() => startEdit(tier)} sx={{ borderRadius: '8px', fontSize: '0.75rem', color: 'text.secondary', '&:hover': { color: '#0077FF', bgcolor: '#f0f7ff' } }}>
                                                            Edit
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>
                    );
                })}
            </Stack>
        </AdminLayout>
    );
}
