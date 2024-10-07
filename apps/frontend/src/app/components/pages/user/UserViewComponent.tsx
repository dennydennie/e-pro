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
import { User } from '@/app/types/user';
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

function UserDetailViewComponent({ userId }: { userId: string }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const data: User = await makeRequest<User>('GET', `/user/${userId}`);
                setUser(data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Could not fetch user details.');
            }
        };

        fetchUser();
    }, [userId]);

    const handleEdit = () => {
        router.push(`/user/edit/${userId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/user/${userId}`);
            router.push('/users');
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Could not delete user.');
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
                {user ? (
                    <VStack spacing={4} align='start'>
                        <Heading>User Details</Heading>
                        <Divider />
                        <Text><strong>Name:</strong> {user.name}</Text>
                        <Text><strong>Email:</strong> {user.email}</Text>
                        <Text><strong>Phone Number:</strong> {user.phoneNumber}</Text>
                        <Text><strong>Role:</strong> {user.role}</Text>
                        <Text><strong>Address:</strong> {user.address}</Text>
                        <Text><strong>Department:</strong> {user.department}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading user details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default UserDetailViewComponent;