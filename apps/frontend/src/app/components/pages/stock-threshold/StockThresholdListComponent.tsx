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
    columnHelper.accessor('product.name', {
        cell: info => info.getValue(),
        header: () => <span>Product Name</span>,
    }),
    columnHelper.accessor('product.description', {
        cell: info => info.getValue(),
        header: () => <span>Product Description</span>,
    }),
    columnHelper.accessor('warehouse.name', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse Name</span>,
    }),
    columnHelper.accessor('warehouse.address', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse Address</span>,
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
                const thresholds: StockThreshold[] = (await makeRequest<StockThreshold[]>('GET', '/stock-threshold')).data;
                setData(thresholds);
            } catch (error) {
                console.warn('Error fetching stock thresholds:', error);
            }
        };

        getStockThresholds();
    }, []);

    const handleCreate = () => {
        router.push('threshold/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`threshold/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Stock Thresholds</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default StockThresholdListComponent;