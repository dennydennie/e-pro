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
import { Factory } from '@/app/types/factory';


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

function FactoryDetailViewComponent({ factoryId }: { factoryId: string }) {
    const [factory, setFactory] = React.useState<Factory | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchFactory = async () => {
            try {
                const data: Factory = (await makeRequest<Factory>('GET', `/factory/${factoryId}`)).data;
                setFactory(data);
            } catch (err) {
                console.error('Error fetching factory:', err);
                setError('Could not fetch factory details.');
            }
        };

        fetchFactory();
    }, [factoryId]);

    const handleEdit = () => {
        router.push(`/factory/edit/${factoryId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/factory/${factoryId}`);
            router.push('/factory');
        } catch (err) {
            console.error('Error deleting factory:', err);
            setError('Could not delete factory.');
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
                {factory ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>{factory.name}</Heading>
                        <Divider />
                        <Text><strong>Address:</strong> {factory.address}</Text>
                        <Text><strong>Latitude:</strong> {factory.latitude}</Text>
                        <Text><strong>Longitude:</strong> {factory.longitude}</Text>
                        <Text><strong>User ID:</strong> {factory.userId}</Text>
                        <Text><strong>Phone Number:</strong> {factory.phoneNumber}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading factory details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default FactoryDetailViewComponent;