import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

export default function DomesticRates({ provider, tiers }) {
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});

    const startEdit = (tier) => {
        setEditing(tier.id);
        setForm({ fee: tier.fee, discount: tier.discount, effective_date: tier.effective_date });
    };

    const save = (tierId) => {
        router.patch(route('admin.rates.update', tierId), form, {
            onSuccess: () => setEditing(null),
        });
    };

    const REGION_LABEL = { ncr_luzon: 'NCR/Luzon', visayas_mindanao: 'Visayas/Mindanao', nationwide: 'Nationwide' };

    return (
        <>
            <Head title={`Admin — Bayad ng ${provider.name}`} />
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Button
                    component={Link}
                    href={route('admin.providers.index')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 3 }}
                >
                    Bumalik
                </Button>

                <Typography variant="h5" fontWeight={700} mb={4}>
                    Bayad ng {provider.name}
                </Typography>

                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Rehiyon</TableCell>
                                <TableCell align="right">Mula (₱)</TableCell>
                                <TableCell align="right">Hanggang (₱)</TableCell>
                                <TableCell align="right">Bayad</TableCell>
                                <TableCell align="right">Diskwento</TableCell>
                                <TableCell align="right">Net</TableCell>
                                <TableCell>Epektibong Petsa</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tiers.map((tier) => (
                                <TableRow key={tier.id}>
                                    <TableCell>{REGION_LABEL[tier.region]}</TableCell>
                                    <TableCell align="right">₱{tier.amount_from.toLocaleString()}</TableCell>
                                    <TableCell align="right">₱{tier.amount_to.toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        {editing === tier.id ? (
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={form.fee}
                                                onChange={(e) => setForm({ ...form, fee: e.target.value })}
                                                sx={{ width: 80 }}
                                            />
                                        ) : `₱${tier.fee}`}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editing === tier.id ? (
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={form.discount}
                                                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                                sx={{ width: 80 }}
                                            />
                                        ) : `₱${tier.discount}`}
                                    </TableCell>
                                    <TableCell align="right">₱{tier.net_fee}</TableCell>
                                    <TableCell>
                                        {editing === tier.id ? (
                                            <TextField
                                                size="small"
                                                type="date"
                                                value={form.effective_date}
                                                onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
                                            />
                                        ) : tier.effective_date}
                                    </TableCell>
                                    <TableCell>
                                        {editing === tier.id ? (
                                            <Box display="flex" gap={1}>
                                                <Button size="small" variant="contained" onClick={() => save(tier.id)}>I-save</Button>
                                                <Button size="small" onClick={() => setEditing(null)}>Ikansela</Button>
                                            </Box>
                                        ) : (
                                            <Button size="small" onClick={() => startEdit(tier)}>I-edit</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}
