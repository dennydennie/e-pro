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
    Spinner,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import makeRequest from '@/app/services/backend';
import { RawMaterial } from './RawMaterialListComponent';

function RawMaterialViewComponent({ materialId }: { materialId: string }) {
    const [material, setMaterial] = React.useState<RawMaterial | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();
    const toast = useToast();

    React.useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const data: RawMaterial = (await makeRequest<RawMaterial>('GET', `/raw-material/${materialId}`)).data;
                setMaterial(data);
            } catch (err) {
                console.error('Error fetching raw material:', err);
                setError('Could not fetch raw material details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterial();
    }, [materialId]);

    const handleEdit = () => {
        router.push(`/raw-material/edit/${materialId}`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await makeRequest('DELETE', `/raw-material/${materialId}`);
            router.push('/raw-material');
            toast({
                title: 'Raw material deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Error deleting raw material:', err);
            setError('Could not delete raw material.');
            toast({
                title: 'Error deleting raw material',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsDeleting(false);
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
            {isLoading ? (
                <VStack spacing={4}>
                    <Spinner size="xl" />
                    <Text>Loading raw material details...</Text>
                </VStack>
            ) : material ? (
                <VStack spacing={4} align='start'>
                    <Heading fontSize={'2xl'} my={4}>{material.name}</Heading>
                    <Divider />
                    
                    <Box>
                        <Text fontWeight="bold" mb={2}>Description:</Text>
                        <Text>{material.description}</Text>
                    </Box>

                    <HStack spacing={4} mt={4}>
                        <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                        <Button 
                            colorScheme="red" 
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            loadingText="Deleting..."
                        >
                            Delete
                        </Button>
                        <Button onClick={() => router.push('/raw-material')}>Back to List</Button>
                    </HStack>
                </VStack>
            ) : (
                <Text>No material found</Text>
            )}
        </Box>
    );
}

export default RawMaterialViewComponent;