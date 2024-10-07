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
import makeRequest from '@/app/services/backend';
import { StockThreshold } from '@/app/types/stock-threshold';

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

const columnHelper = createColumnHelper<StockThreshold>();

const columns = [
    columnHelper.accessor('productId', {
        cell: info => info.getValue(),
        header: () => <span>Product ID</span>,
    }),
    columnHelper.accessor('warehouseId', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse ID</span>,
    }),
    columnHelper.accessor('lowStockThreshold', {
        cell: info => info.getValue(),
        header: () => <span>Low Stock Threshold</span>,
    }),
    columnHelper.accessor('highStockThreshold', {
        cell: info => info.getValue(),
        header: () => <span>High Stock Threshold</span>,
    }),
];

function StockThresholdListComponent() {
    const [data, setData] = React.useState<StockThreshold[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getStockThresholds = async () => {
            try {
                const thresholds: StockThreshold[] = (await makeRequest<StockThreshold[]>('GET', '/stock-thresholds')).data; 
                setData(thresholds);
            } catch (error) {
                console.warn('Error fetching stock thresholds:', error);
            }
        };

        getStockThresholds();
    }, []);

    const handleCreate = () => {
        router.push('stock-threshold/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`stock-threshold/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Stock Thresholds</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default StockThresholdListComponent;