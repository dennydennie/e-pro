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
import { Order } from '@/app/types/order';


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

function OrderDetailViewComponent({ orderId }:{orderId: string}) {
    const [order, setOrder] = React.useState<Order | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data: Order = (await makeRequest<Order>('GET', `/order/${orderId}`)).data;
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Could not fetch order details.');
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleEdit = () => {
        router.push(`/order/edit/${orderId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/order/${orderId}`);
            router.push('/order'); 
        } catch (err) {
            console.error('Error deleting order:', err);
            setError('Could not delete order.');
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
                {order ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>Order Details</Heading>
                        <Divider />
                        <Text><strong>Customer:</strong> {order.customer.name}</Text>
                        <Text><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</Text>
                        <Text><strong>Expected Delivery Date:</strong> {new Date(order.expectedDeliveryDate).toLocaleDateString()}</Text>
                        <Text><strong>Nature:</strong> {order.nature}</Text>
                        <Text><strong>Status:</strong> {order.status}</Text>
                        <Text><strong>Notes:</strong> {order.notes}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading order details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default OrderDetailViewComponent;