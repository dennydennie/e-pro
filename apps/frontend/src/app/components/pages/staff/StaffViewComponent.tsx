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
import { FactoryStaff } from '@/app/types/factory-staff';


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

function FactoryStaffDetailViewComponent({ staffId }: {staffId: string}) {
    const [factoryStaff, setFactoryStaff] = React.useState<FactoryStaff | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchFactoryStaff = async () => {
            try {
                const data: FactoryStaff = await makeRequest<FactoryStaff>('GET', `/factory-staff/${staffId}`);
                setFactoryStaff(data);
            } catch (err) {
                console.error('Error fetching factory staff:', err);
                setError('Could not fetch factory staff details.');
            }
        };

        fetchFactoryStaff();
    }, [staffId]);

    const handleEdit = () => {
        router.push(`/factory-staff/edit/${staffId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/factory-staff/${staffId}`);
            router.push('/factory-staff'); 
        } catch (err) {
            console.error('Error deleting factory staff:', err);
            setError('Could not delete factory staff.');
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
                {factoryStaff ? (
                    <VStack spacing={4} align='start'>
                        <Heading>{factoryStaff.jobTitle}</Heading>
                        <Divider />
                        <Text><strong>User ID:</strong> {factoryStaff.userId}</Text>
                        <Text><strong>Factory ID:</strong> {factoryStaff.factoryId}</Text>
                        <Text><strong>Job Title:</strong> {factoryStaff.jobTitle}</Text>
                        <Text><strong>Department:</strong> {factoryStaff.department}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading factory staff details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default FactoryStaffDetailViewComponent;