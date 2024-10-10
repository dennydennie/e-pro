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
import { FactoryStaff } from '@/app/types/factory-staff';
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

const columnHelper = createColumnHelper<FactoryStaff>();

const columns = [
    columnHelper.accessor('userId', {
        cell: info => info.getValue(),
        header: () => <span>User ID</span>,
    }),
    columnHelper.accessor('factoryId', {
        cell: info => info.getValue(),
        header: () => <span>Factory ID</span>,
    }),
    columnHelper.accessor('jobTitle', {
        cell: info => info.getValue(),
        header: () => <span>Job Title</span>,
    }),
    columnHelper.accessor('department', {
        cell: info => info.getValue(),
        header: () => <span>Department</span>,
    }),
];

function FactoryStaffListComponent() {
    const [data, setData] = React.useState<FactoryStaff[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getFactoryStaff = async () => {
            try {
                const staff: FactoryStaff[] = (await makeRequest<FactoryStaff[]>('GET', '/factory-staff')).data; 
                console.log(staff);
                setData(staff);
            } catch (error) {
                console.warn('Error fetching factory staff:', error);
            }
        };
        getFactoryStaff();
    }, []);

    const handleCreate = () => {
        router.push('staff/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`staff/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Factory Staff</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default FactoryStaffListComponent;