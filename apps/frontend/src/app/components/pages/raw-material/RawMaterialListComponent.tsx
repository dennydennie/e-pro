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

export interface RawMaterial {
    id: string;
    name: string;
    description: string;
}

function RawMaterialListComponent() {
    const [data, setData] = React.useState<RawMaterial[]>(() => []);
    const [loading, setLoading] = React.useState<boolean>();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        try {
            await makeRequest('DELETE', `/raw-material/${id}`);
            // Refresh the list after deletion
            const updatedMaterials = data.filter(material => material.id !== id);
            setData(updatedMaterials);
        } catch (error) {
            console.error('Error deleting raw material:', error);
        }
    };

    const handleEdit = (id: string) => {
        router.push(`raw-material/edit/${id}`);
    };

    const columnHelper = createColumnHelper<RawMaterial>();

    const columns = [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
        }),
        columnHelper.accessor('description', {
            cell: info => info.getValue(),
            header: () => <span>Description</span>,
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
        const getRawMaterials = async () => {
            setLoading(true);
            try {
                const materials: RawMaterial[] = (await makeRequest<RawMaterial[]>('GET', '/raw-material')).data;
                setData(materials);
            } catch (error) {
                console.warn('Error fetching raw materials:', error);
            } finally {
                setLoading(false)
            }
        };
        getRawMaterials();
    }, []);

    if(!!loading){
        return <Loading/>
    }

    const handleCreate = () => {
        router.push('raw-material/add');
    };

    const handleRowClick = (id: string) => {
        router.push(`raw-material/edit/${id}`);
    };

    return (
        <Box p={4}>
            <Heading fontSize={'2xl'} my={4}>Raw Materials</Heading>
            <Box h={4} />
            <CustomButton type={undefined} icon={FaPlus} action={handleCreate} />
            <CustomTable data={data} columns={columns} handleRowClick={handleRowClick} />
        </Box>
    );
}

export default RawMaterialListComponent;