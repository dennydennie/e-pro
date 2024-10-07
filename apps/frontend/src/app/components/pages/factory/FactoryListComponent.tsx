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
    columnHelper.accessor('userId', {
        cell: info => info.getValue(),
        header: () => <span>User ID</span>,
    }),
    columnHelper.accessor('phoneNumber', {
        cell: info => info.getValue(),
        header: () => <span>Phone Number</span>,
    }),
];

function FactoryListComponent() {
    const [data, setData] = React.useState<Factory[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getFactories = async () => {
            try {
                const factories: Factory[] = await makeRequest<Factory[]>('GET', '/factory'); 
                setData(factories);
            } catch (error) {
                console.warn('Error fetching factories:', error);
            }
        };
        getFactories();
    }, []);

    const handleCreate = () => {
        router.push('factory/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`factory/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Factories</Heading>
                <Box h={4} />
                <CustomButton type={undefined} title={'Add Factory'} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default FactoryListComponent;