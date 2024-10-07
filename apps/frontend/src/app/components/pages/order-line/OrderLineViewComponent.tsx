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
import { OrderLine } from '@/app/types/order-line';


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

function OrderLineDetailViewComponent({ orderLineId }: { orderLineId: string }) {
    const [orderLine, setOrderLine] = React.useState<OrderLine | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchOrderLine = async () => {
            try {
                const data: OrderLine = (await makeRequest<OrderLine>('GET', `/order-line/${orderLineId}`)).data;
                setOrderLine(data);
            } catch (err) {
                console.error('Error fetching order line:', err);
                setError('Could not fetch order line details.');
            }
        };

        fetchOrderLine();
    }, [orderLineId]);

    const handleEdit = () => {
        router.push(`/order-line/edit/${orderLineId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/order-line/${orderLineId}`);
            router.push('/order-line');
        } catch (err) {
            console.error('Error deleting order line:', err);
            setError('Could not delete order line.');
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
                {orderLine ? (
                    <VStack spacing={4} align='start'>
                        <Heading>Order Line Details</Heading>
                        <Divider />
                        <Text><strong>Order ID:</strong> {orderLine.orderId}</Text>
                        <Text><strong>Product ID:</strong> {orderLine.productId}</Text>
                        <Text><strong>Quantity:</strong> {orderLine.quantity}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading order line details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default OrderLineDetailViewComponent;