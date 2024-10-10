import * as React from 'react';
import {
    Box,
    Heading,
    extendTheme,
    ChakraProvider,
    IconButton
} from '@chakra-ui/react';
import {
    createColumnHelper
} from '@tanstack/react-table';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CustomButton from '../../shared/CustomButton';
import CustomTable from '../../shared/CustomTable';
import { Customer } from '@/app/types/customer';
import makeRequest from '@/app/services/backend';
import Loading from '../../shared/Loading';

function CustomerListComponent() {
    const [data, setData] = React.useState<Customer[]>(() => []);
    const [loading, setLoading] = React.useState<boolean>();

    const router = useRouter();
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

    const handleDelete = (id: string) => {
        console.log(`Deleting record with id: ${id}`);
    };

    const handleEdit = (id: string) => {
        router.push(`customer/edit/${id}`);
    };

    const columnHelper = createColumnHelper<Customer>();

    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
        }),
        columnHelper.accessor('email', {
            cell: info => info.getValue(),
            header: () => <span>Email</span>,
        }),
        columnHelper.accessor('contactPerson', {
            cell: info => info.getValue(),
            header: () => <span>Contact Person</span>,
        }),
        columnHelper.accessor('contactPersonMobile', {
            cell: info => info.getValue(),
            header: () => <span>Contact Person Mobile</span>,
        }),
        columnHelper.accessor('shippingAddress', {
            cell: info => info.getValue(),
            header: () => <span>Shipping Address</span>,
        }),
        columnHelper.accessor('shippingLatitude', {
            cell: info => info.getValue(),
            header: () => <span>Shipping Latitude</span>,
        }),
        columnHelper.accessor('shippingLongitude', {
            cell: info => info.getValue(),
            header: () => <span>Shipping Longitude</span>,
        }),
        columnHelper.accessor('id', {
            cell: info => (
                <div style={{ display: 'flex', gap: '8px' }}>
                <IconButton
                    aria-label="Edit"
                    icon={<FaEdit />}
                    colorScheme="blue"
                    onClick={() => handleEdit(info.getValue()!)}
                />
                <IconButton
                    aria-label="Delete"
                    icon={<FaTrash />}
                    colorScheme="red"
                    onClick={() => handleDelete(info.getValue()!)}
                />
            </div>
            ),
            header: () => <span>Actions</span>,
        }),
    ];


    React.useEffect(() => {
        const getCustomers = async () => {
            setLoading(true);
            try {
                const customers: Customer[] = (await makeRequest<Customer[]>('GET', '/customer')).data;
                setData(customers);
            } catch (error) {
                console.warn('Error fetching customers:', error);
            } finally {
                setLoading(false)
            }
        };
        getCustomers();
    }, []);

    const handleCreate = () => {
        router.push('customer/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`customer/edit/${id}`);
    };

    if (!!loading) {
        return <Loading />
    }

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Customers</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default CustomerListComponent;