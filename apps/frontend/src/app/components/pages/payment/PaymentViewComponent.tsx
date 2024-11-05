import * as React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    extendTheme,
    ChakraProvider,
    VStack,
    HStack,
    Divider,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import makeRequest from '@/app/services/backend';
import { Payment, PaymentDetail } from '@/app/types/payment';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            },
        },
    },
});

function PaymentDetailViewComponent({ paymentId }: { paymentId: string }) {
    const [payment, setPayment] = React.useState<PaymentDetail | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchPayment = async () => {
            try {
                const data: PaymentDetail = (await makeRequest<PaymentDetail>('GET', `/payment/summary/${paymentId}`)).data;
                setPayment(data);
            } catch (err) {
                console.error('Error fetching payment:', err);
                setError('Could not fetch payment details.');
            }
        };

        fetchPayment();
    }, [paymentId]);

    const handleEdit = () => {
        router.push(`/payment/edit/${paymentId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/payment/${paymentId}`);
            router.push('/payment');
        } catch (err) {
            console.error('Error deleting payment:', err);
            setError('Could not delete payment.');
        }
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                {payment ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>Payment Details</Heading>
                        <Divider />
                        <Text><strong>Customer:</strong> {payment.customer.name}</Text>
                        <Text><strong>Amount:</strong> ${payment.amount.toFixed(2)}</Text>
                        <Text><strong>Currency:</strong> {payment.currency}</Text>
                        <Text><strong>Method:</strong> {payment.method}</Text>
                        <Text><strong>Status:</strong> {payment.status}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading payment details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default PaymentDetailViewComponent;