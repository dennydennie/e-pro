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
import { User } from '@/app/types/user'; 
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

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => <span>Name</span>,
    }),
    columnHelper.accessor('email', {
        cell: info => info.getValue(),
        header: () => <span>Email</span>,
    }),
    columnHelper.accessor('phoneNumber', {
        cell: info => info.getValue(),
        header: () => <span>Phone Number</span>,
    }),
    columnHelper.accessor('role', {
        cell: info => info.getValue(),
        header: () => <span>Role</span>,
    }),
    columnHelper.accessor('address', {
        cell: info => info.getValue(),
        header: () => <span>Address</span>,
    }),
    columnHelper.accessor('department', {
        cell: info => info.getValue(),
        header: () => <span>Department</span>,
    }),
];

function UserListComponent() {
    const [data, setData] = React.useState<User[]>(() => []);
    const router = useRouter();

    React.useEffect(() => {
        const getUsers = async () => {
            try {
                const users: User[] = (await makeRequest<User[]>('GET', '/user')).data;
                setData(users);
            } catch (error) {
                console.warn('Error fetching users:', error);
            }
        };

        getUsers();
    }, []);

    const handleCreate = () => {
        router.push('user/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`user/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading>Users</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default UserListComponent;