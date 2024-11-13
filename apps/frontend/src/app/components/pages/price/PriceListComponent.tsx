import * as React from 'react';
import {
    Box,
    Heading,
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

export interface Price {
    id: string;
    price: number;
    supplier: {
        id: string;
        name: string;
    };
    rawMaterial: {
        id: string;
        name: string;
    };
}

export interface PriceForm {
    id?: string;
    price: number;
    supplierId: string;    
    rawMaterialId: string; 
}

function PriceListComponent() {
    const [data, setData] = React.useState<Price[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            await makeRequest('DELETE', `/price/${id}`);
            // Refresh the list after deletion
            const updatedPrices = data.filter(price => price.id !== id);
            setData(updatedPrices);
        } catch (error) {
            console.error('Error deleting price:', error);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`price/edit/${id}`);
    };

    const columnHelper = createColumnHelper<Price>();

    const columns = [
        columnHelper.accessor('rawMaterial.name', {
            cell: info => info.getValue(),
            header: () => <span>Raw Material</span>,
        }),
        columnHelper.accessor('supplier.name', {
            cell: info => info.getValue(),
            header: () => <span>Supplier</span>,
        }),
        columnHelper.accessor('price', {
            cell: info => {
                const value = info.getValue();
                return value != null ? `$${Number(value).toFixed(2)}` : '-';
            },
            header: () => <span>Price</span>,
        }),
        columnHelper.accessor('id', {
            cell: info => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <IconButton
                        aria-label="Edit"
                        icon={<FaEdit />}
                        colorScheme="blue"
                        onClick={() => handleEdit(info.getValue())}
                    />
                    <IconButton
                        aria-label="Delete"
                        icon={<FaTrash />}
                        colorScheme="red"
                        onClick={() => handleDelete(info.getValue())}
                    />
                </div>
            ),
            header: () => <span>Actions</span>,
        }),
    ];

    React.useEffect(() => {
        const getPrices = async () => {
            setLoading(true);
            try {
                const response = await makeRequest<Price[]>('GET', '/price');
                setData(response.data);
            } catch (error) {
                console.warn('Error fetching prices:', error);
            } finally {
                setLoading(false);
            }
        };
        getPrices();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const handleCreate = () => {
        router.push('price/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`price/edit/${id}`);
    };

    return (
        <Box p={4}>
            <Heading fontSize={'2xl'} my={4}>Price List</Heading>
            <Box h={4} />
            <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
            <CustomTable 
                data={data} 
                columns={columns} 
                handleRowClick={handleRowClick}
            />
        </Box>
    );
}

export default PriceListComponent;