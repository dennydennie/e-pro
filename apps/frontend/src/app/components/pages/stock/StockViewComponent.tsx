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
import { Stock } from '@/app/types/stock'; 
import makeRequest from '@/app/services/backend';


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

function StockDetailViewComponent({ stockId }: { stockId: string }) {
    const [stock, setStock] = React.useState<Stock | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchStock = async () => {
            try {
                const data: Stock = (await makeRequest<Stock>('GET', `/stock/${stockId}`)).data;
                setStock(data);
            } catch (err) {
                console.error('Error fetching stock:', err);
                setError('Could not fetch stock details.');
            }
        };

        fetchStock();
    }, [stockId]);

    const handleEdit = () => {
        router.push(`/stock/edit/${stockId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/stock/${stockId}`);
            router.push('/stock');
        } catch (err) {
            console.error('Error deleting stock:', err);
            setError('Could not delete stock.');
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
                {stock ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>Stock Details</Heading>
                        <Divider />
                        <Text><strong>Product:</strong> {stock.product.name}</Text>
                        <Text><strong>Warehouse:</strong> {stock.warehouse.name}</Text>
                        <Text><strong>Quantity:</strong> {stock.quantity}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading stock details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default StockDetailViewComponent;