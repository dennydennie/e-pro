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
import { OrderLine } from '@/app/types/order-line';
import makeRequest from '@/app/services/backend';
import { useState } from 'react';
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

const columnHelper = createColumnHelper<OrderLine>();

const columns = [
    columnHelper.accessor('product.name', {
        cell: info => info.getValue(),
        header: () => <span>Product Name</span>,
    }),
    columnHelper.accessor('quantity', {
        cell: info => info.getValue(),
        header: () => <span>Quantity</span>,
    }),
    columnHelper.accessor('product.price', {
        cell: info => {
            const price = info?.getValue();
            return !!price ? `$${price.toFixed(2)}` : '$0.00';
        },
        header: () => <span>Unit Price</span>,
    }),
    columnHelper.accessor('order', {
        cell: info => {
            const quantity = info.row.original.quantity;
            const price = info.row.original.product.price;
            const totalCost = (quantity * price) || 0;
            return `$${totalCost.toFixed(2)}`;
        },
        header: () => <span>Total Cost</span>,
    }),
];



interface OrderLineListComponentProps {
    orderId: string;
}

function OrderLineListComponent({ orderId }: OrderLineListComponentProps) {
    const router = useRouter();
    const [orderLines, setOrderLines] = React.useState<OrderLine[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchOrderLines = async () => {
            if (orderId) {
                try {
                    const data = (await makeRequest<OrderLine[]>('GET', `/order-line/order/${orderId}`)).data;
                    setOrderLines(data);
                } catch (err) {
                    setError('Failed to load order lines');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrderLines();
    }, [orderId]);

    if (loading) return <Loading />;


    const handleCreate = () => {
        router.push(`/order-lines/add?orderId=${orderId}`);
    };

    const handleRowClick = (id: string) => {
        router.push(`/order-lines/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Order Lines</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={orderLines} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default OrderLineListComponent;