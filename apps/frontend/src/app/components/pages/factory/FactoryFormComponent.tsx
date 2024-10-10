import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Factory } from "@/app/types/factory";
import makeRequest from "@/app/services/backend";
import { Customer } from "@/app/types/customer";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/user";
import { createFactorySchema } from "./factory-schema";

interface FactoryFormProps {
    initialData?: Factory;
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
        "ui:widget": "text"
    },
    longitude: {
        "ui:widget": "text"
    },
    id: {
        "ui:widget": "hidden"
    },
    "ui:submitButtonOptions": { norender: true },
};

const FactoryForm: React.FC<FactoryFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await makeRequest<User[]>('GET', '/user');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchFormData();

    }, []);

    const id = initialData?.id ?? "";
    const factorySchema = createFactorySchema(users, id);

    const handleCancel = () => {
        router.push('/factory');
    };

    const handleSubmit = async (data: IChangeEvent<Factory>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Factory>('PATCH', `/factory/${formData.id}`, formData);
            } else {
                response = await makeRequest<Factory>('POST', '/factory', { ...formData, id: undefined });
            }

            if (response.status === 200 || response.status === 201) {
                setMessageType('success');
                setMessage("The operation was successful!");
            } else {
                throw new Error("Something went wrong!");
            }

            setIsMessageModalOpen(true);
        } catch (error: any) {
            console.error('Error occurred while processing the form:', error);
            setMessageType('error');
            setMessage(error.message || 'Something went wrong!');
            setIsMessageModalOpen(true);
        }
    };

    return (
        <Box width="50%">
            <Heading my={4}>Add Factory</Heading>
            <Form
                schema={factorySchema}
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
                onClose={() => {
                    setIsMessageModalOpen(false);
                    handleCancel();
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default FactoryForm;