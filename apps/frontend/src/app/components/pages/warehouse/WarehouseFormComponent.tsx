import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { createWarehouseSchema } from "./warehouse-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Warehouse } from "@/app/types/warehouse";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";
import { Factory } from "@/app/types/factory";

interface WarehouseFormProps {
    initialData?: Warehouse;
}

const uiSchema = {
    name: {
        "ui:widget": "text"
    },
    address: {
        "ui:widget": "text"
    },
    phoneNumber: {
        "ui:options": {
            "inputType": "tel"
        }
    },
    latitude: {
        "ui:widget": "updown"
    },
    longitude: {
        "ui:widget": "updown"
    },
    maxCapacity: {
        "ui:widget": "updown"
    },
    id: {
        "ui:widget": "hidden"
    }
};

const WarehouseForm: React.FC<WarehouseFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [factories, setFactories] = useState<Factory[]>([]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await makeRequest<Factory[]>('GET', '/factory');
                setFactories(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchFormData();

    }, []);

    const id = initialData?.id ?? '';
    const warehouseSchema = createWarehouseSchema(factories, id)

    if (!!initialData) {
        warehouseSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/warehouse');
    }

    const handleSubmit = async (data: IChangeEvent<Warehouse>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;
            const isUpdating = formData.id !== "";

            const method = isUpdating ? 'PATCH' : 'POST';
            const url = isUpdating ? `/warehouse/${formData.id}` : '/warehouse';
            const requestData = isUpdating ? formData : { ...formData, id: undefined };

            response = await makeRequest<Warehouse>(method, url, requestData);

            const message = response.status === (isUpdating ? 200 : 201)
                ? "The operation was successful!"
                : "Something went wrong!";

            const messageType = response.status === (isUpdating ? 200 : 201) ? 'success' : 'error';

            setMessageType(messageType);
            setMessage(message);
            setIsMessageModalOpen(true);

        } catch (error) {
            console.error('Error occurred while processing the form:', error);
        }
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Warehouse' : 'Add Warehouse'}
            </Heading>
            <Form
                schema={warehouseSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                validator={validator}
            >
                <HStack mt={4} spacing={8}>
                    <Button type="submit" colorScheme="blue">
                        Submit
                    </Button>
                    <Button colorScheme="red" onClick={handleCancel} aria-label="Cancel action">
                        Cancel
                    </Button>
                </HStack>
            </Form>
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    setIsMessageModalOpen(false);
                    handleCancel();
                }
                }
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default WarehouseForm;