import { Head, router } from '@inertiajs/react';
import {
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Stack,
    Divider,
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';

const REGIONS = [
    { value: 'ncr', label: 'NCR (Metro Manila)' },
    { value: 'luzon', label: 'Luzon' },
    { value: 'visayas', label: 'Visayas' },
    { value: 'mindanao', label: 'Mindanao' },
];

export default function Home({ providers = [] }) {
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

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Gradient Hero */}
                <Box
                    sx={{
                        background: 'linear-gradient(160deg, #0055cc 0%, #0077FF 45%, #00C2FF 100%)',
                        pt: { xs: 6, md: 10 },
                        pb: { xs: 12, md: 16 },
                        px: 2,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative blobs */}
                    <Box sx={{
                        position: 'absolute', top: -60, right: -60, width: 280, height: 280,
                        borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
                    }} />
                    <Box sx={{
                        position: 'absolute', bottom: -40, left: -40, width: 200, height: 200,
                        borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                    }} />

                    <Container maxWidth="sm" sx={{ position: 'relative', textAlign: 'center' }}>
                        {/* Logo mark */}
                        <Box sx={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 60, height: 60, borderRadius: '18px',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(8px)',
                            mb: 2,
                        }}>
                            <CompareArrowsIcon sx={{ fontSize: 32, color: '#fff' }} />
                        </Box>

                        <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
                            PadalaHub
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', mb: 0.5 }}>
                            Hanapin ang pinakamurang paraan
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>
                            ng pagpapadala ng pera sa Pilipinas
                        </Typography>

                       
                    </Container>
                </Box>

                {/* Floating Card */}
                <Container maxWidth="sm" sx={{ mt: { xs: -8, md: -10 }, pb: 6, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 2 }}>
                    <Paper elevation={0} sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: '24px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            Magkano ang ipapadala?
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Ilagay ang halaga at rehiyon para makita ang pinakamababang bayad.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2.5}>
                                <TextField
                                    label="Halaga"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setErrors({}); }}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
                                    inputProps={{ min: 1, max: 50000 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>₱</Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="1,000"
                                    fullWidth
                                />

                                <Box>
                                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                        <LocationOnIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            LOKASYON
                                        </Typography>
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                        <FormControl fullWidth error={!!errors.senderRegion} size="small">
                                            <InputLabel>Nagpapadala (mula)</InputLabel>
                                            <Select
                                                value={senderRegion}
                                                label="Nagpapadala (mula)"
                                                onChange={(e) => { setSenderRegion(e.target.value); setErrors({}); }}
                                            >
                                                {REGIONS.map((r) => (
                                                    <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                                ))}
                                            </Select>
                                            {errors.senderRegion && (
                                                <Typography variant="caption" sx={{ color: 'error.main', ml: 1.5, mt: 0.5 }}>{errors.senderRegion}</Typography>
                                            )}
                                        </FormControl>

                                        <FormControl fullWidth error={!!errors.recipientRegion} size="small">
                                            <InputLabel>Tatanggap (patungo)</InputLabel>
                                            <Select
                                                value={recipientRegion}
                                                label="Tatanggap (patungo)"
                                                onChange={(e) => { setRecipientRegion(e.target.value); setErrors({}); }}
                                            >
                                                {REGIONS.map((r) => (
                                                    <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                                                ))}
                                            </Select>
                                            {errors.recipientRegion && (
                                                <Typography variant="caption" sx={{ color: 'error.main', ml: 1.5, mt: 0.5 }}>{errors.recipientRegion}</Typography>
                                            )}
                                        </FormControl>
                                    </Stack>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{ py: 1.75, fontSize: '1rem', mt: 0.5 }}
                                >
                                    Ihambing ang Bayad
                                </Button>
                            </Stack>
                        </form>

                        <Divider sx={{ my: 3 }} />

                        <Stack direction="row" justifyContent="center" spacing={4}>
                            {[['Libre', 'Walang bayad'], ['Real-time', 'Updated data'], ['5 providers', 'Ikinukumpara']].map(([label, sub]) => (
                                <Box key={label} textAlign="center">
                                    <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{label}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>

                    {/* International Coming Soon */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                            Paparating din
                        </Typography>

                        <Paper elevation={0} sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, #f8faff 0%, #eef3ff 100%)',
                            border: '1px dashed #c5d5ff',
                            boxShadow: 'none',
                        }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                        International Remittance
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Wise · Remitly · Western Union
                                    </Typography>
                                </Box>
                                <Chip label="Coming Soon" size="small" sx={{ bgcolor: '#e8efff', color: '#0055cc', fontWeight: 700 }} />
                            </Stack>
                        </Paper>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
