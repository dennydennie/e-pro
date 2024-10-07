import * as React from 'react';
import {
    Box,
    Heading,
    extendTheme,
    ChakraProvider
} from '@chakra-ui/react';
import {
    createColumnHelper
} from '@tanstack/react-table';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CustomButton from '../../shared/CustomButton';
import CustomTable from '../../shared/CustomTable';
import { Product } from '@/app/types/product'; 
import makeRequest from '@/app/services/backend';


const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'blue.50', 
                color: 'blue.800', 
            },
        },
    },
});

const columnHelper = createColumnHelper<Product>();

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => <span>Product Name</span>,
    }),
    columnHelper.accessor('description', {
        cell: info => info.getValue(),
        header: () => <span>Description</span>,
    }),
    columnHelper.accessor('price', {
        cell: info => info.getValue(),
        header: () => <span>Price ($)</span>,
    }),
    columnHelper.accessor('unit', {
        cell: info => info.getValue(),
        header: () => <span>Unit</span>,
    }),
    columnHelper.accessor('mass', {
        cell: info => info.getValue(),
        header: () => <span>Mass (kg)</span>,
    }),
    columnHelper.accessor('volume', {
        cell: info => info.getValue(),
        header: () => <span>Volume (L)</span>,
    }),
    columnHelper.accessor('dimensions', {
        cell: info => info.getValue(),
        header: () => <span>Dimensions</span>,
    }),
    columnHelper.accessor('expiryDate', {
        cell: info => info.getValue(),
        header: () => <span>Expiry Date</span>,
    }),
];

function ProductListComponent() {
    const [data, setData] = React.useState<Product[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getProducts = async () => {
            try {
                const products: Product[] = (await makeRequest<Product[]>('GET', '/product')).data; 
                setData(products);
            } catch (error) {
                console.warn('Error fetching products:', error);
            }
        };
        getProducts();
    }, []);

    const handleCreate = () => {
        router.push('product/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`product/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Products</Heading>
                <Box h={4} />
                <CustomButton type={undefined} title={'Add Product'} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default ProductListComponent;