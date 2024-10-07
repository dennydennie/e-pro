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
import { Warehouse } from '@/app/types/warehouse';
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

function WarehouseDetailViewComponent({ warehouseId }: { warehouseId: string }) {
    const [warehouse, setWarehouse] = React.useState<Warehouse | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchWarehouse = async () => {
            try {
                const data: Warehouse = await makeRequest<Warehouse>('GET', `/warehouse/${warehouseId}`);
                setWarehouse(data);
            } catch (err) {
                console.error('Error fetching warehouse:', err);
                setError('Could not fetch warehouse details.');
            }
        };

        fetchWarehouse();
    }, [warehouseId]);

    const handleEdit = () => {
        router.push(`/warehouse/edit/${warehouseId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/warehouse/${warehouseId}`);
            router.push('/warehouse');
        } catch (err) {
            console.error('Error deleting warehouse:', err);
            setError('Could not delete warehouse.');
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
                {warehouse ? (
                    <VStack spacing={4} align='start'>
                        <Heading>Warehouse Details</Heading>
                        <Divider />
                        <Text><strong>ID:</strong> {warehouse.id}</Text>
                        <Text><strong>Factory ID:</strong> {warehouse.factoryId}</Text>
                        <Text><strong>Name:</strong> {warehouse.name}</Text>
                        <Text><strong>Address:</strong> {warehouse.address}</Text>
                        <Text><strong>Latitude:</strong> {warehouse.latitude}</Text>
                        <Text><strong>Longitude:</strong> {warehouse.longitude}</Text>
                        <Text><strong>Phone Number:</strong> {warehouse.phoneNumber}</Text>
                        <Text><strong>Max Capacity:</strong> {warehouse.maxCapacity}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading warehouse details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default WarehouseDetailViewComponent;