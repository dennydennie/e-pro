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
import { Warehouse } from '@/app/types/warehouse';
import makeRequest from '@/app/services/backend';
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

const columnHelper = createColumnHelper<Warehouse>();

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => <span>Warehouse Name</span>,
    }),
    columnHelper.accessor('address', {
        cell: info => info.getValue(),
        header: () => <span>Address</span>,
    }),
    columnHelper.accessor('latitude', {
        cell: info => info.getValue(),
        header: () => <span>Latitude</span>,
    }),
    columnHelper.accessor('longitude', {
        cell: info => info.getValue(),
        header: () => <span>Longitude</span>,
    }),
    columnHelper.accessor('maxCapacity', {
        cell: info => info.getValue(),
        header: () => <span>Max Capacity</span>,
    }),
];

function WarehouseListComponent() {
    const [data, setData] = React.useState<Warehouse[]>(() => []);
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const getWarehouses = async () => {
            setLoading(true);
            try {
                const warehouses: Warehouse[] = (await makeRequest<Warehouse[]>('GET', '/warehouse')).data;
                setData(warehouses);
            } catch (error) {
                console.warn('Error fetching warehouses:', error);
            } finally {
                setLoading(false);
            }
        };

        getWarehouses();
    }, []);

    if (!!loading) {
        return <Loading />
    }

    const handleCreate = () => {
        router.push('warehouse/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`warehouse/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Warehouses</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default WarehouseListComponent;