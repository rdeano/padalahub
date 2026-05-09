import { Head, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

const REGIONS = [
    { value: 'ncr', label: 'NCR (Metro Manila)' },
    { value: 'luzon', label: 'Luzon' },
    { value: 'visayas', label: 'Visayas' },
    { value: 'mindanao', label: 'Mindanao' },
];

export default function Home() {
    const [amount, setAmount] = useState('');
    const [senderRegion, setSenderRegion] = useState('');
    const [recipientRegion, setRecipientRegion] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!amount || isNaN(amount) || +amount < 1) errs.amount = 'Ilagay ang tamang halaga.';
        if (!senderRegion) errs.senderRegion = 'Piliin ang rehiyon ng nagpapadala.';
        if (!recipientRegion) errs.recipientRegion = 'Piliin ang rehiyon ng tatanggap.';
        if (Object.keys(errs).length) return setErrors(errs);

        router.get(route('compare.domestic'), {
            amount,
            sender_region: senderRegion,
            recipient_region: recipientRegion,
        });
    };

    return (
        <>
            <Head>
                <title>PadalaHub — Ihambing ang Bayad sa Remittance</title>
                <meta name="description" content="Hanapin ang pinakamura at pinakamabilis na paraan ng pagpapadala ng pera sa Pilipinas. Ihambing ang Palawan, Cebuana, LBC, GCash, at iba pa." />
            </Head>

            <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Container maxWidth="sm" sx={{ py: 8 }}>
                    <Stack spacing={3} alignItems="center" mb={5}>
                        <Typography variant="h3" fontWeight={700} color="primary" textAlign="center">
                            PadalaHub
                        </Typography>
                        <Typography variant="h6" color="text.secondary" textAlign="center">
                            Hanapin ang pinakamurang paraan ng pagpapadala ng pera
                        </Typography>
                    </Stack>

                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Halaga (₱)"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
                                    inputProps={{ min: 1, max: 50000 }}
                                    fullWidth
                                />

                                <FormControl fullWidth error={!!errors.senderRegion}>
                                    <InputLabel>Rehiyon ng Nagpapadala</InputLabel>
                                    <Select
                                        value={senderRegion}
                                        label="Rehiyon ng Nagpapadala"
                                        onChange={(e) => setSenderRegion(e.target.value)}
                                    >
                                        {REGIONS.map((r) => (
                                            <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.senderRegion && (
                                        <Typography variant="caption" color="error" ml={2}>{errors.senderRegion}</Typography>
                                    )}
                                </FormControl>

                                <FormControl fullWidth error={!!errors.recipientRegion}>
                                    <InputLabel>Rehiyon ng Tatanggap</InputLabel>
                                    <Select
                                        value={recipientRegion}
                                        label="Rehiyon ng Tatanggap"
                                        onChange={(e) => setRecipientRegion(e.target.value)}
                                    >
                                        {REGIONS.map((r) => (
                                            <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.recipientRegion && (
                                        <Typography variant="caption" color="error" ml={2}>{errors.recipientRegion}</Typography>
                                    )}
                                </FormControl>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    endIcon={<SendIcon />}
                                    fullWidth
                                >
                                    Ihambing ang Bayad
                                </Button>
                            </Stack>
                        </form>
                    </Paper>

                    <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
                        Libreng gamitin. Walang account na kailangan.
                    </Typography>
                </Container>
            </Box>
        </>
    );
}
