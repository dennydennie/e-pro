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
import { Order } from '@/app/types/order'; 
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

const columnHelper = createColumnHelper<Order>();

const columns = [
    columnHelper.accessor('customerId', {
        cell: info => info.getValue(),
        header: () => <span>Customer ID</span>,
    }),
    columnHelper.accessor('orderDate', {
        cell: info => info.getValue(),
        header: () => <span>Order Date</span>,
    }),
    columnHelper.accessor('expectedDeliveryDate', {
        cell: info => info.getValue(),
        header: () => <span>Expected Delivery Date</span>,
    }),
    columnHelper.accessor('notes', {
        cell: info => info.getValue(),
        header: () => <span>Notes</span>,
    }),
    columnHelper.accessor('nature', {
        cell: info => info.getValue(),
        header: () => <span>Nature</span>,
    }),
    columnHelper.accessor('status', {
        cell: info => info.getValue(),
        header: () => <span>Status</span>,
    }),
];

function OrderListComponent() {
    const [data, setData] = React.useState<Order[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getOrders = async () => {
            try {
                const orders: Order[] = await makeRequest<Order[]>('GET', '/order'); 
                setData(orders);
            } catch (error) {
                console.warn('Error fetching orders:', error);
            }
        };
        getOrders();
    }, []);

    const handleCreate = () => {
        router.push('order/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`order/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Orders</Heading>
                <Box h={4} />
                <CustomButton type={undefined} title={'Add Order'} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default OrderListComponent;