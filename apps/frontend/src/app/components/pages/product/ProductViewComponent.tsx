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
import { Product } from '@/app/types/product';


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

function ProductDetailViewComponent({ productId }: {productId: string}) {
    const [product, setProduct] = React.useState<Product | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data: Product = (await makeRequest<Product>('GET', `/product/${productId}`)).data;
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Could not fetch product details.');
            }
        };

        fetchProduct();
    }, [productId]);

    const handleEdit = () => {
        router.push(`/product/edit/${productId}`);
    };

    const handleDelete = async () => {
        try {
            await makeRequest('DELETE', `/product/${productId}`);
            router.push('/product'); 
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Could not delete product.');
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
                {product ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>{product.name}</Heading>
                        <Divider />
                        <Text><strong>Description:</strong> {product.description}</Text>
                        <Text><strong>Price:</strong> ${product.price.toFixed(2)}</Text>
                        <Text><strong>Unit:</strong> {product.unit}</Text>
                        {product.mass && <Text><strong>Mass:</strong> {product.mass} kg</Text>}
                        {product.volume && <Text><strong>Volume:</strong> {product.volume} L</Text>}
                        <Text><strong>Dimensions:</strong> {product.dimensions}</Text>
                        <Text><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</Text>
                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                        </HStack>
                    </VStack>
                ) : (
                    <Text>Loading product details...</Text>
                )}
            </Box>
        </ChakraProvider>
    );
}

export default ProductDetailViewComponent;