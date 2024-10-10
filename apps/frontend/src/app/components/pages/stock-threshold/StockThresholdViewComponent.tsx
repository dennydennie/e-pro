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
import { StockThreshold } from '@/app/types/stock-threshold';


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

function StockThresholdDetailViewComponent({ stockThresholdId }: {stockThresholdId: string}) {
    const [stockThreshold, setStockThreshold] = React.useState<StockThreshold | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchStockThreshold = async () => {
            try {
                const data: StockThreshold = (await makeRequest<StockThreshold>('GET', `/stock-threshold/${stockThresholdId}`)).data;
                setStockThreshold(data);
            } catch (err) {
                console.error('Error fetching stock threshold:', err);
                setError('Could not fetch stock threshold details.');
            }
        };

        fetchStockThreshold();
    }, [stockThresholdId]);

    const handleEdit = () => {
        router.push(`/stock-threshold/edit/${stockThresholdId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/stock-threshold/${stockThresholdId}`);
            router.push('/stock-threshold'); 
        } catch (err) {
            console.error('Error deleting stock threshold:', err);
            setError('Could not delete stock threshold.');
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
                {stockThreshold ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>Stock Threshold Details</Heading>
                        <Divider />
                        <Text><strong>Product ID:</strong> {stockThreshold.productId}</Text>
                        <Text><strong>Warehouse ID:</strong> {stockThreshold.warehouseId}</Text>
                        <Text><strong>Low Stock Threshold:</strong> {stockThreshold.lowStockThreshold}</Text>
                        <Text><strong>High Stock Threshold:</strong> {stockThreshold.highStockThreshold}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading stock threshold details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default StockThresholdDetailViewComponent;