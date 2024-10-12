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
import moment from 'moment';
import Loading from '../../shared/Loading';

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
    columnHelper.accessor('customer.name', {
        cell: info => info.getValue(),
        header: () => <span>Customer</span>,
    }),
    columnHelper.accessor('orderDate', {
        cell: info => moment(info.getValue()).format('YYYY MMM DD'),
        header: () => <span>Order Date</span>,
    }),
    columnHelper.accessor('expectedDeliveryDate', {
        cell: info => moment(info.getValue()).format('YYYY MMM DD'),
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
    }), ,
];

function OrderListComponent() {
    const [data, setData] = React.useState<Order[]>(() => []);
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const getOrders = async () => {
            setLoading(true);
            try {
                const orders: Order[] = (await makeRequest<Order[]>('GET', '/order')).data;
                setData(orders);
            } catch (error) {
                console.warn('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        getOrders();
    }, []);

    if (!!loading) {
        return <Loading />
    }

    const handleCreate = () => {
        router.push('order/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`order-lines/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Orders</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default OrderListComponent;