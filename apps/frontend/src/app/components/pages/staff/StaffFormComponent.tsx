import React, { useState, useEffect } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { FactoryStaff } from "@/app/types/factory-staff";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { Factory } from "@/app/types/factory";
import { User } from "@/app/types/user";
import { createFactoryStaffSchema } from "./staff-schema";
import { handleResponse } from "@/app/utils/handle-api-response";

interface FactoryStaffFormProps {
    initialData?: FactoryStaff;
}

const uiSchema = {
    jobTitle: {
        "ui:widget": "text"
    },
    department: {
        "ui:widget": "text"
    }, id: {
        "ui:widget": "hidden"
    }
};

const FactoryStaffForm: React.FC<FactoryStaffFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [factories, setFactories] = useState<Factory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const factotiesResponse = await makeRequest<Factory[]>('GET', '/factory');
                setFactories(factotiesResponse.data);

                const usersResponse = await makeRequest<User[]>('GET', '/user');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const id = initialData?.id ?? '';

    const factoryStaffSchema = createFactoryStaffSchema(users, factories, id);

    const handleCancel = () => {
        router.push('/staff');
    }

    const handleSubmit = async (data: IChangeEvent<FactoryStaff>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;
            const isUpdating = formData.id !== "";
            const method = isUpdating ? 'PATCH' : 'POST';
            const url = isUpdating ? `/factory-staff/${formData.id}` : '/factory-staff';
            const requestData = isUpdating ? formData : { ...formData, id: undefined };

            response = await makeRequest<FactoryStaff>(method, url, requestData);

            handleResponse(response.status, setMessage, setMessageType, setIsMessageModalOpen);

        } catch (error: any) {
            console.error('Error occurred while processing the form:', error);
            const errorMessage = `Error: ${error.message}`;
            setMessageType('error');
            setMessage(errorMessage);
            setIsMessageModalOpen(true);
        }
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Staff Roles' : 'Add Staff Roles'}
            </Heading>
            <Form
                schema={factoryStaffSchema}
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

export default FactoryStaffForm;