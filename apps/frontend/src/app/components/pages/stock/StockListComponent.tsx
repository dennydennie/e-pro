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
import { Stock } from '@/app/types/stock'; 
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

const columnHelper = createColumnHelper<Stock>();

const columns = [
    columnHelper.accessor('product.name', {
        cell: info => info.getValue(),
        header: () => <span>Product</span>,
    }),
    columnHelper.accessor('product.description', {
        cell: info => info.getValue(),
        header: () => <span>Product Description</span>,
    }),
    columnHelper.accessor('product.mass', {
        cell: info => info.getValue(),
        header: () => <span>Product Mass</span>,
    }),
    columnHelper.accessor('product.volume', {
        cell: info => info.getValue(),
        header: () => <span>Product Volume</span>,
    }),
    columnHelper.accessor('warehouse.name', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse Name</span>,
    }),
    columnHelper.accessor('quantity', {
        cell: info => info.getValue(),
        header: () => <span>Quantity</span>,
    }),
];

function StockListComponent() {
    const [data, setData] = React.useState<Stock[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getStocks = async () => {
            try {
                const stocks: Stock[] = (await makeRequest<Stock[]>('GET', '/stock')).data; 
                setData(stocks);
            } catch (error) {
                console.warn('Error fetching stocks:', error);
            }
        };

        getStocks();
    }, []);

    const handleCreate = () => {
        router.push('stock/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`stock/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Stock</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default StockListComponent;