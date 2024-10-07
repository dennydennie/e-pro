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
import { Customer } from '@/app/types/customer';


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

function CustomerDetailViewComponent({ customerId }: { customerId: string }) {
    const [customer, setCustomer] = React.useState<Customer | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data: Customer = (await makeRequest<Customer>('GET', `/customer/${customerId}`)).data;
                setCustomer(data);
            } catch (err) {
                console.error('Error fetching customer:', err);
                setError('Could not fetch customer details.');
            }
        };

        fetchCustomer();
    }, [customerId]);

    const handleEdit = () => {
        router.push(`/customer/edit/${customerId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/customer/${customerId}`);
            router.push('/customers');
        } catch (err) {
            console.error('Error deleting customer:', err);
            setError('Could not delete customer.');
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
                {customer ? (
                    <VStack spacing={4} align='start'>
                        <Heading>{customer.name}</Heading>
                        <Divider />
                        <Text><strong>Email:</strong> {customer.email}</Text>
                        <Text><strong>Contact Person:</strong> {customer.contactPerson}</Text>
                        <Text><strong>Contact Person Mobile:</strong> {customer.contactPersonMobile}</Text>
                        <Text><strong>Shipping Address:</strong> {customer.shippingAddress}</Text>
                        <Text><strong>Shipping Latitude:</strong> {customer.shippingLatitude}</Text>
                        <Text><strong>Shipping Longitude:</strong> {customer.shippingLongitude}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading customer details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default CustomerDetailViewComponent;