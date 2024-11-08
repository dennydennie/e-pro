import React, { useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { User } from "@/app/types/user";
import { userSchema } from "./user-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { handleResponse } from "@/app/utils/handle-api-response";
import { useSession } from "next-auth/react";

interface UserFormProps {
    initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as User;

    if (!!initialData) {
        userSchema.properties.id.default = initialData?.id as string;
    }
    const handleCancel = () => {
        router.push('/user');
    }
    const handleSubmit = async (data: IChangeEvent<User>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<User>('PATCH', `/user/${formData.id}`, formData);
            } else {
                response = await makeRequest<User>('POST', '/user', { ...formData, id: undefined });
            }

            handleResponse(response.status, setMessage, setMessageType, setIsMessageModalOpen);

        } catch (error: any) {
            console.error('Error occurred while processing the form:', error);
            const errorMessage = `Error: ${error.message}`;
            setMessageType('error');
            setMessage(errorMessage);
            setIsMessageModalOpen(true);
        }
    };

    const getUiSchema = () => {
        const baseSchema = {
            name: {
                "ui:widget": "text"
            },
            password: {
                "ui:widget": "password"
            },
            phoneNumber: {
                "ui:options": {
                    "inputType": "tel"
                }
            },
            address: {
                "ui:widget": "textarea"
            },
            id: {
                "ui:widget": "hidden"
            }
        };

        if (user?.role === 'admin') {
            return {
                ...baseSchema,
                role: {
                    "ui:widget": "select",
                    "ui:placeholder": "Select a role",
                    "ui:options": {
                        enumOptions: [
                            { value: "admin", label: "Admin" },
                            { value: "manager", label: "Manager" },
                            { value: "staff", label: "Staff" }
                        ]
                    }
                },
                department: {
                    "ui:widget": "text"
                }
            };
        }

        return baseSchema;
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit User' : 'Add User'}
            </Heading>
            <Form
                schema={userSchema}
                uiSchema={getUiSchema()}
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
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default UserForm;