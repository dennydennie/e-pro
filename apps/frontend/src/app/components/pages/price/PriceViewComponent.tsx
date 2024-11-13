import * as React from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Divider,
    Alert,
    AlertIcon,
    useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import makeRequest from '@/app/services/backend';

interface Price {
    id: string;
    price: number;
    supplier: {
        id: string;
        name: string;
    };
    rawMaterial: {
        id: string;
        name: string;
    };
}

function PriceViewComponent({ priceId }: { priceId: string }) {
    const [price, setPrice] = React.useState<Price | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    const toast = useToast();

    React.useEffect(() => {
        const fetchPrice = async () => {
            try {
                const response = await makeRequest<Price>('GET', `/price/${priceId}`);
                setPrice(response.data);
            } catch (err) {
                console.error('Error fetching price:', err);
                setError('Could not fetch price details.');
            }
        };

        fetchPrice();
    }, [priceId]);

    const handleEdit = () => {
        router.push(`/price/edit/${priceId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/price/${priceId}`);
            router.push('/price');
            toast({
                title: 'Price deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Error deleting price:', err);
            setError('Could not delete price.');
            toast({
                title: 'Error deleting price',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4}>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            {price ? (
                <VStack spacing={4} align='start'>
                    <Heading fontSize={'2xl'} my={4}>Price Details</Heading>
                    <Divider />
                    
                    <Box width="100%">
                        <Text fontWeight="bold" mb={2}>Raw Material:</Text>
                        <Text>{price.rawMaterial.name}</Text>
                    </Box>

                    <Box width="100%">
                        <Text fontWeight="bold" mb={2}>Supplier:</Text>
                        <Text>{price.supplier.name}</Text>
                    </Box>

                    <Box width="100%">
                        <Text fontWeight="bold" mb={2}>Price:</Text>
                        <Text>${price.price.toFixed(2)}</Text>
                    </Box>

                    <HStack spacing={4} mt={4}>
                        <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                        <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        <Button onClick={() => router.push('/price')}>Back to List</Button>
                    </HStack>
                </VStack>
            ) : (
                <Text>Loading price details...</Text>
            )}
        </Box>
    );
}

export default PriceViewComponent;