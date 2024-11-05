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
import Loading from '../../shared/Loading';
import { useSession } from 'next-auth/react';

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
    const [loading, setLoading] = React.useState(true);
    const { data: userData, status } = useSession();
    const user: User | undefined = userData?.user as User;

    if (!user) {
        return <Loading />
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        const getUsers = async () => {
            setLoading(true);
            try {
                let users: User[];
                if (user.role === 'admin') {
                    users = (await makeRequest<User[]>('GET', '/user')).data;
                } else {
                    users = [(await makeRequest<User>('GET', `/user/${user.id}`)).data];
                }
                setData(users);
            } catch (error) {
                console.warn('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [user?.id, user?.role]);

    if (!!loading) {
        return <Loading />
    }

    const handleCreate = () => {
        router.push('user/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`user/edit/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Users</Heading>
                <Box h={4} />
                {
                    user?.role === 'admin' && (
                        <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                    )
                }
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default UserListComponent;