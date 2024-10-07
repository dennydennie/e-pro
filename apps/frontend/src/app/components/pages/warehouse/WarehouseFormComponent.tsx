import React, { useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { warehouseSchema } from "./warehouse-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Warehouse } from "@/app/types/warehouse";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";

interface WarehouseFormProps {
    initialData?: Warehouse;
}

const uiSchema = {
    factoryId: {
        "ui:widget": "text"
    },
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

            if (formData.id !== "") {
                response = await makeRequest<Warehouse>('PATCH', `/warehouse/${formData.id}`, formData);
                if (response.status === 200) {
                    const success = "The operation was successful!";
                    setMessageType('success');
                    setMessage(success);
                    setIsMessageModalOpen(true);
                } else {
                    const error = "Something went wrong!";
                    setMessageType('error');
                    setMessage(error);
                    setIsMessageModalOpen(true);
                }
            } else {
                response = await makeRequest<Warehouse>('POST', '/warehouse', {...formData, id: undefined});
                if (response.status === 201) {
                    const success = "The operation was successful!";
                    setMessageType('success');
                    setMessage(success);
                    setIsMessageModalOpen(true);
                } else {
                    const error = "Something went wrong!";
                    setMessageType('error');
                    setMessage(error);
                    setIsMessageModalOpen(true);
                }
            }

        } catch (error) {
            console.error('Error occurred while processing the form:', error);
        }
    };

    return (
        <Box width="50%">
             <Heading my={4}>Add Warehouse</Heading>
            <Form
                schema={warehouseSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                liveValidate
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
                onClose={() => setIsMessageModalOpen(false)}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default WarehouseForm;