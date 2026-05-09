import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

export default function ProvidersIndex({ providers }) {
    const toggleActive = (provider) => {
        router.patch(route('admin.providers.update', provider.id), {
            name: provider.name,
            affiliate_url: provider.affiliate_url,
            is_active: !provider.is_active,
        });
    };

    return (
        <>
            <Head title="Admin — Providers" />
            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Typography variant="h5" fontWeight={700} mb={4}>
                    Mga Provider
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Pangalan</TableCell>
                                <TableCell>Uri</TableCell>
                                <TableCell>Rehiyon</TableCell>
                                <TableCell>Aktibo</TableCell>
                                <TableCell>Bayad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {providers.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.type}
                                            size="small"
                                            color={p.type === 'domestic' ? 'default' : 'primary'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {p.is_nationwide
                                            ? 'Nationwide'
                                            : p.regions.map((r) => r.region).join(', ')}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={p.is_active}
                                            onChange={() => toggleActive(p)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {p.type === 'domestic' && (
                                            <Button
                                                component={Link}
                                                href={route('admin.rates.domestic', p.id)}
                                                size="small"
                                                variant="outlined"
                                            >
                                                I-edit ang Bayad
                                            </Button>
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
