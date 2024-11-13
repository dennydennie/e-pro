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
import makeRequest from '@/app/services/backend';
import Loading from '../../shared/Loading';

export interface Supplier {
    id?: string| undefined;
    name: string;
    address: string;
    lat: number;
    lon: number;
    contactNumber: string;
    taxClearance: string;
    taxExpiry: Date;
    prazNumber: string;
    vatNumber: string;
}

function SupplierListComponent() {
    const [data, setData] = React.useState<Supplier[]>(() => []);
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

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            console.log(`Deleting record with id: ${id}`);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`supplier/edit/${id}`);
    };

    const columnHelper = createColumnHelper<Supplier>();

    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
        }),
        columnHelper.accessor('address', {
            cell: info => info.getValue(),
            header: () => <span>Address</span>,
        }),
        columnHelper.accessor('contactNumber', {
            cell: info => info.getValue(),
            header: () => <span>Contact Number</span>,
        }),
        columnHelper.accessor('prazNumber', {
            cell: info => info.getValue(),
            header: () => <span>PRAZ Number</span>,
        }),
        columnHelper.accessor('vatNumber', {
            cell: info => info.getValue(),
            header: () => <span>VAT Number</span>,
        }),
        columnHelper.accessor('taxExpiry', {
            cell: info => new Date(info.getValue()).toLocaleDateString(),
            header: () => <span>Tax Expiry</span>,
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
        const getSuppliers = async () => {
            setLoading(true);
            try {
                const suppliers: Supplier[] = (await makeRequest<Supplier[]>('GET', '/supplier')).data;
                setData(suppliers);
            } catch (error) {
                console.warn('Error fetching suppliers:', error);
            } finally {
                setLoading(false)
            }
        };
        getSuppliers();
    }, []);

    if(!!loading){
        return <Loading/>
    }

    const handleCreate = () => {
        router.push('supplier/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`supplier/view/${id}`);
    };

    return (
        <ChakraProvider theme={theme}>
            <Box p={4}>
                <Heading fontSize={'2xl'} my={4}>Suppliers</Heading>
                <Box h={4} />
                <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
                <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
            </Box>
        </ChakraProvider>
    );
}

export default SupplierListComponent;