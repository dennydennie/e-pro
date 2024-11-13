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
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Textarea,
    Select,
    useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import makeRequest from '@/app/services/backend';
import { StarIcon } from '@chakra-ui/icons';
import { Supplier } from './SupplierListComponent';

export interface Review {
    id: string;
    description: string;
    rating: number;
    supplier: Supplier;
    created: Date;
}

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

function SupplierViewComponent({ supplierId }: { supplierId: string }) {
    const [supplier, setSupplier] = React.useState<Supplier | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rating, setRating] = React.useState<number>(5);
    const [description, setDescription] = React.useState<string>('');
    const [reviews, setReviews] = React.useState<Review[]>([]);
    const toast = useToast();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = React.useState(true);

    React.useEffect(() => {
        const fetchSupplier = async () => {
            setIsLoading(true);
            try {
                const data: Supplier = (await makeRequest<Supplier>('GET', `/supplier/${supplierId}`)).data;
                setSupplier(data);
            } catch (err) {
                console.error('Error fetching supplier:', err);
                setError('Could not fetch supplier details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSupplier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const response = await makeRequest<Review[]>('GET', `/review/${supplierId}`);
                if (response.data) {
                    setReviews(response.data);
                } else {
                    setReviews([]);
                    toast({
                        title: 'No reviews found',
                        status: 'info',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
                toast({
                    title: 'Error loading reviews',
                    description: 'Unable to load supplier reviews',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setReviews([]);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [supplierId, toast]);

    const handleEdit = () => {
        router.push(`/supplier/edit/${supplierId}`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await makeRequest('DELETE', `/supplier/${supplierId}`);
            router.push('/suppliers');
        } catch (err) {
            console.error('Error deleting supplier:', err);
            setError('Could not delete supplier.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSubmitReview = async () => {
        setIsSubmittingReview(true);
        try {
            const newReview = {
                description,
                rating,
                supplierId: supplierId,
            };

            await makeRequest('POST', `/review`, newReview);
            
            const updatedReviews = (await makeRequest<Review[]>('GET', `/review/${supplierId}`)).data;
            setReviews(updatedReviews);
            
            setDescription('');
            setRating(5);
            onClose();

            toast({
                title: 'Review submitted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error('Error submitting review:', err);
            toast({
                title: `Error submitting review, please try again. ${err.message}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getTaxExpiryStatus = (expiryDate: Date) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return { color: 'red', text: 'Expired' };
        } else if (daysUntilExpiry <= 30) {
            return { color: 'yellow', text: 'Expiring Soon' };
        }
        return { color: 'green', text: 'Valid' };
    };

    const RatingStars = ({ rating }: { rating: number }) => (
        <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    color={star <= rating ? 'yellow.400' : 'gray.300'}
                />
            ))}
        </HStack>
    );

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                {isLoading ? (
                    <Text>Loading supplier details...</Text>
                ) : supplier ? (
                    <VStack spacing={4} align='start'>
                        <Heading fontSize={'2xl'} my={4}>{supplier.name}</Heading>
                        <Divider />
                        
                        <Text><strong>Contact Number:</strong> {supplier.contactNumber}</Text>
                        <Text><strong>Address:</strong> {supplier.address}</Text>
                        <Text>
                            <strong>Location Coordinates:</strong> {supplier.lat}, {supplier.lon}
                        </Text>
                        
                        <Box>
                            <Text><strong>PRAZ Number:</strong> {supplier.prazNumber}</Text>
                            <Text><strong>VAT Number:</strong> {supplier.vatNumber}</Text>
                        </Box>
                        
                        <Box>
                            <Text>
                                <strong>Tax Clearance:</strong> {supplier.taxClearance}
                                <Button size="sm" ml={2} colorScheme="blue" variant="outline">
                                    View Document
                                </Button>
                            </Text>
                            <HStack>
                                <Text><strong>Tax Expiry:</strong> {new Date(supplier.taxExpiry).toLocaleDateString()}</Text>
                                <Badge colorScheme={getTaxExpiryStatus(supplier.taxExpiry).color}>
                                    {getTaxExpiryStatus(supplier.taxExpiry).text}
                                </Badge>
                            </HStack>
                        </Box>

                        <Box w="100%">
                            <Heading size="md" mb={2}>Reviews</Heading>
                            <Button colorScheme="green" onClick={onOpen} mb={4}>
                                Add Review
                            </Button>
                            
                            {isLoadingReviews ? (
                                <Text>Loading reviews...</Text>
                            ) : (
                                <VStack spacing={4} align="stretch">
                                    {reviews.map((review) => (
                                        <Box 
                                            key={review.id} 
                                            p={4} 
                                            borderWidth={1} 
                                            borderRadius="md"
                                            bg="white"
                                        >
                                            <HStack mb={2}>
                                                <RatingStars rating={review.rating} />
                                                <Text color="gray.500">
                                                    {new Date(review.created).toLocaleDateString()}
                                                </Text>
                                            </HStack>
                                            <Text>{review.description}</Text>
                                        </Box>
                                    ))}
                                </VStack>
                            )}
                        </Box>

                        <HStack spacing={4}>
                            <Button colorScheme="blue" onClick={handleEdit}>Edit</Button>
                            <Button 
                                colorScheme="red" 
                                onClick={handleDelete}
                                isLoading={isDeleting}
                                loadingText="Deleting..."
                            >
                                Delete
                            </Button>
                        </HStack>
                    </VStack>
                ) : null}

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Review</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl mb={4}>
                                <FormLabel>Rating</FormLabel>
                                <Select 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value={5}>5 - Excellent</option>
                                    <option value={4}>4 - Very Good</option>
                                    <option value={3}>3 - Good</option>
                                    <option value={2}>2 - Fair</option>
                                    <option value={1}>1 - Poor</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Write your review here..."
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button 
                                colorScheme="blue" 
                                mr={3} 
                                onClick={handleSubmitReview}
                                isLoading={isSubmittingReview}
                                loadingText="Submitting..."
                            >
                                Submit Review
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    );
}

export default SupplierViewComponent;