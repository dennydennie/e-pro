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
import moment from 'moment';
import Loading from '../../shared/Loading';
import { PaymentDetail } from '@/app/types/payment';
import { useSession } from 'next-auth/react';
import { User } from '@/app/types/user';

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

const columnHelper = createColumnHelper<PaymentDetail>();

const columns = [
    columnHelper.accessor('customer.name', {
        cell: info => info.getValue(),
        header: () => <span>Customer</span>,
    }),
    columnHelper.accessor('amount', {
        cell: info => `$${info.getValue().toFixed(2)}`,
        header: () => <span>Amount</span>,
    }),
    columnHelper.accessor('currency', {
        cell: info => info.getValue(),
        header: () => <span>Currency</span>,
    }),
    columnHelper.accessor('method', {
        cell: info => info.getValue(),
        header: () => <span>Payment Method</span>,
    }),
    columnHelper.accessor('status', {
        cell: info => info.getValue(),
        header: () => <span>Status</span>,
    }),
    columnHelper.accessor('date', {
        cell: info => moment(info.getValue()).format('YYYY MMM DD'),
        header: () => <span>Payment Date</span>,
    }),
];

function PaymentListComponent() {
    const [data, setData] = React.useState<PaymentDetail[]>(() => []);
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    const { data: userData, status } = useSession();
    const user: User | undefined = userData?.user as User;
    const isAdmin = user?.role !== 'user' || false;

    React.useEffect(() => {
        const getPayments = async () => {
            setLoading(true);
            try {
                const payments: PaymentDetail[] = (await makeRequest<PaymentDetail[]>('GET', '/payment')).data;
                setData(payments);
            } catch (error) {
                console.warn('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };
        getPayments();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const handleCreate = () => {
        router.push('payment/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`payment/view/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Payments</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                {
                    isAdmin && (
                        <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
                    )
                }
            </Box>
        </ChakraProvider>
    );
}

export default PaymentListComponent;