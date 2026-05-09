import { Head, Link } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const REGION_LABELS = {
    ncr: 'NCR (Metro Manila)',
    luzon: 'Luzon',
    visayas: 'Visayas',
    mindanao: 'Mindanao',
};

export default function Domestic({ results, amount, senderRegion, recipientRegion }) {
    return (
        <>
            <Head>
                <title>Resulta ng Paghahambing — PadalaHub</title>
                <meta name="description" content={`Ihambing ang bayad sa pagpapadala ng ₱${amount} mula ${REGION_LABELS[senderRegion]} patungong ${REGION_LABELS[recipientRegion]}.`} />
            </Head>

            <Container maxWidth="md" sx={{ py: 5 }}>
                <Button
                    component={Link}
                    href={route('home')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 3 }}
                >
                    Bumalik
                </Button>

                <Typography variant="h5" fontWeight={700} mb={1}>
                    Resulta ng Paghahambing
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    Nagpapadala ng <strong>₱{Number(amount).toLocaleString()}</strong> mula{' '}
                    <strong>{REGION_LABELS[senderRegion]}</strong> patungong{' '}
                    <strong>{REGION_LABELS[recipientRegion]}</strong>
                </Typography>

                {results.length === 0 ? (
                    <Alert severity="info">
                        Walang nahanap na provider. Subukan ang ibang rehiyon.
                    </Alert>
                ) : (
                    <TableContainer component={Paper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell><strong>Provider</strong></TableCell>
                                    <TableCell align="right"><strong>Bayad</strong></TableCell>
                                    <TableCell align="right"><strong>Diskwento</strong></TableCell>
                                    <TableCell align="right"><strong>Net na Bayad</strong></TableCell>
                                    <TableCell align="center"><strong>Aksyon</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((item, idx) => (
                                    <TableRow
                                        key={item.provider.id}
                                        sx={idx === 0 ? { bgcolor: 'success.light' } : {}}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>
                                                    <Typography fontWeight={600}>
                                                        {item.provider.name}
                                                    </Typography>
                                                    {item.provider.requires_account && (
                                                        <Chip
                                                            label="Kailangan ng account (libre)"
                                                            size="small"
                                                            color="info"
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    )}
                                                </Box>
                                                {idx === 0 && (
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label="Pinakamura"
                                                        size="small"
                                                        color="success"
                                                    />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">₱{item.fee}</TableCell>
                                        <TableCell align="right">
                                            {item.discount > 0 ? `-₱${item.discount}` : '—'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight={700} color={idx === 0 ? 'success.dark' : 'inherit'}>
                                                ₱{item.net_fee}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.provider.affiliate_url ? (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    href={item.provider.affiliate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Pumunta
                                                </Button>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    Walk-in
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {results.length > 0 && (
                    <Typography variant="caption" color="text.secondary" mt={2} display="block">
                        Huling na-update: {results[0]?.effective_date}. Maaaring magbago ang mga bayad nang walang paunawa.
                    </Typography>
                )}
            </Container>
        </>
    );
}
