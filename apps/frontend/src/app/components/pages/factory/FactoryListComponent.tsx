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
import { Factory } from '@/app/types/factory';
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

const columnHelper = createColumnHelper<Factory>();

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => <span>Factory Name</span>,
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
    columnHelper.accessor('manager.name', {
        cell: info => info.getValue(),
        header: () => <span>Manager</span>,
    }),
];

function FactoryListComponent() {
    const [data, setData] = React.useState<Factory[]>(() => []);
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const getFactories = async () => {
            setLoading(true);
            try {
                const factories: Factory[] = (await makeRequest<Factory[]>('GET', '/factory')).data;
                setData(factories);
            } catch (error) {
                console.warn('Error fetching factories:', error);
            } finally {
                setLoading(false);
            }
        };
        getFactories();
    }, []);

    if (!!loading) {
        return <Loading />
    }

    const handleCreate = () => {
        router.push('factory/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`factory/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Factories</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default FactoryListComponent;