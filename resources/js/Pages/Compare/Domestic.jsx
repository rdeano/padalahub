import { Head, Link } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const REGION_LABELS = {
    ncr: 'NCR',
    luzon: 'Luzon',
    visayas: 'Visayas',
    mindanao: 'Mindanao',
};

const PROVIDER_INITIALS = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const PROVIDER_COLORS = {
    palawan: '#e65100',
    cebuana: '#b71c1c',
    mlhuillier: '#1a237e',
    lbc: '#004d40',
    gcash: '#0077FF',
};

export default function Domestic({ results, amount, senderRegion, recipientRegion }) {
    return (
        <>
            <Head>
                <title>Resulta ng Paghahambing — PadalaHub</title>
                <meta name="description" content={`Ihambing ang bayad sa pagpapadala ng ₱${amount} mula ${REGION_LABELS[senderRegion]} patungong ${REGION_LABELS[recipientRegion]}.`} />
            </Head>

            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Header bar */}
                <Box sx={{
                    background: 'linear-gradient(160deg, #0055cc 0%, #0077FF 45%, #00C2FF 100%)',
                    pt: 3, pb: 8, px: 2,
                }}>
                    <Container maxWidth="sm">
                        <Button
                            component={Link}
                            href={route('home')}
                            startIcon={<ArrowBackIcon />}
                            sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, pl: 0, '&:hover': { background: 'transparent', color: '#fff' } }}
                        >
                            Bumalik
                        </Button>

                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <CompareArrowsIcon sx={{ color: 'rgba(255,255,255,0.8)', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                Resulta
                            </Typography>
                        </Stack>

                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                            ₱{Number(amount).toLocaleString()}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', mt: 0.5 }}>
                            {REGION_LABELS[senderRegion]} → {REGION_LABELS[recipientRegion]}
                        </Typography>
                    </Container>
                </Box>

                {/* Result cards */}
                <Container maxWidth="sm" sx={{ mt: -5, pb: 6, px: { xs: 2, sm: 3 } }}>
                    {results.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
                            <Typography sx={{ fontSize: '2rem', mb: 1 }}>😕</Typography>
                            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Walang nahanap</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                Walang provider na available sa iyong rehiyon.
                            </Typography>
                            <Button component={Link} href={route('home')} variant="contained">
                                Subukan ulit
                            </Button>
                        </Paper>
                    ) : (
                        <Stack spacing={2}>
                            {results.map((item, idx) => {
                                const isBest = idx === 0;
                                const color = PROVIDER_COLORS[item.provider.slug] ?? '#555';

                                return (
                                    <Paper
                                        key={item.provider.id}
                                        elevation={0}
                                        sx={{
                                            p: 0,
                                            overflow: 'hidden',
                                            boxShadow: isBest
                                                ? '0 8px 32px rgba(0,196,140,0.2), 0 2px 8px rgba(0,0,0,0.06)'
                                                : '0 4px 20px rgba(0,0,0,0.07)',
                                            border: isBest ? '2px solid #00C48C' : '2px solid transparent',
                                        }}
                                    >
                                        {isBest && (
                                            <Box sx={{
                                                bgcolor: 'success.main',
                                                px: 2, py: 0.75,
                                                display: 'flex', alignItems: 'center', gap: 0.75,
                                            }}>
                                                <CheckCircleIcon sx={{ fontSize: 16, color: '#fff' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
                                                    PINAKAMURA
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ p: 2.5 }}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                {/* Avatar */}
                                                <Box sx={{
                                                    width: 48, height: 48, borderRadius: '14px',
                                                    background: color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}>
                                                    <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '0.85rem' }}>
                                                        {PROVIDER_INITIALS(item.provider.name)}
                                                    </Typography>
                                                </Box>

                                                {/* Name & badges */}
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography noWrap sx={{ fontWeight: 700 }}>
                                                        {item.provider.name}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap" gap={0.5}>
                                                        {item.provider.requires_account && (
                                                            <Chip label="Kailangan ng account" size="small" color="info" />
                                                        )}
                                                        {item.provider.is_nationwide && (
                                                            <Chip label="Nationwide" size="small" variant="outlined" />
                                                        )}
                                                        {!item.provider.is_nationwide && (
                                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                <StorefrontIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Walk-in</Typography>
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Box>

                                                {/* Fee */}
                                                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <Typography sx={{
                                                        fontWeight: 800,
                                                        fontSize: '1.4rem',
                                                        color: isBest ? 'success.dark' : 'text.primary',
                                                    }}>
                                                        ₱{item.net_fee}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>bayad</Typography>
                                                </Box>
                                            </Stack>

                                            {(item.discount > 0 || item.provider.affiliate_url) && (
                                                <>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        {item.discount > 0 ? (
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                Orihinal: <s>₱{item.fee}</s> &nbsp;
                                                                <Typography component="span" variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                                                    -₱{item.discount} diskwento
                                                                </Typography>
                                                            </Typography>
                                                        ) : <Box />}

                                                        {item.provider.affiliate_url && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<ArrowForwardIcon />}
                                                                href={item.provider.affiliate_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Pumunta
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </>
                                            )}
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    )}

                    {results.length > 0 && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 3, display: 'block', textAlign: 'center' }}>
                            Huling na-update: {results[0]?.effective_date} · Maaaring magbago ang mga bayad nang walang paunawa.
                        </Typography>
                    )}
                </Container>
            </Box>
        </>
    );
}
