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
    columnHelper.accessor('productId', {
        cell: info => info.getValue(),
        header: () => <span>Product ID</span>,
    }),
    columnHelper.accessor('warehouseId', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse ID</span>,
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
                const stocks: Stock[] = await makeRequest<Stock[]>('GET', '/stock'); 
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
                <Heading>Stock</Heading>
                <Box h={4} />
                <CustomButton type={undefined} title={'Add Stock'} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default StockListComponent;