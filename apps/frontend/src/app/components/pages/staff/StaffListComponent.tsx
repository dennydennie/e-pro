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
import { FactoryStaff, FactoryStaffDetail } from '@/app/types/factory-staff';
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

const columnHelper = createColumnHelper<FactoryStaffDetail>();

const columns = [
    columnHelper.accessor('user.name', {
        cell: info => info.getValue(),
        header: () => <span>User Name</span>,
    }),
    columnHelper.accessor('user.email', {
        cell: info => info.getValue(),
        header: () => <span>User Email</span>,
    }),
    columnHelper.accessor('user.phoneNumber', {
        cell: info => info.getValue(),
        header: () => <span>User Email</span>,
    }),
    columnHelper.accessor('factory.name', {
        cell: info => info.getValue(),
        header: () => <span>Factory Name</span>,
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
    const [data, setData] = React.useState<FactoryStaffDetail[]>(() => []);
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const getFactoryStaff = async () => {
            setLoading(true);
            try {
                const staff: FactoryStaffDetail[] = (await makeRequest<FactoryStaffDetail[]>('GET', '/factory-staff')).data;
                console.log(staff);
                setData(staff);
            } catch (error) {
                console.warn('Error fetching factory staff:', error);
            } finally {
                setLoading(false);
            }
        };
        getFactoryStaff();
    }, []);

    if (!!loading) {
        return <Loading />
    }

    const handleCreate = () => {
        router.push('staff/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`staff/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Factory Staff</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default FactoryStaffListComponent;