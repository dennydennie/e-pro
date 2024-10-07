import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { User } from "@/app/types/user";
import { userSchema } from "./user-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";

interface UserFormProps {
    initialData?: User;
}

const uiSchema = {
    name: {
        "ui:widget": "text"
    },
    email: {
        "ui:widget": "email"
    },
    password: {
        "ui:widget": "password"
    },
    phoneNumber: {
           "ui:options": {
      "inputType": "tel"
    }
    },
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
    address: {
        "ui:widget": "textarea"
    },
    department: {
        "ui:widget": "text"
    },
    id: {
        "ui:widget": "hidden"
    }
};

const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        userSchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<User>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (!!formData.id) {
                response = await makeRequest<User>('PUT', `/user/${formData.id}`, formData);
                const success = "The operation was successful!";
                setMessageType('success');
                setMessage(success);
                setIsMessageModalOpen(true);
            } else {
                response = await makeRequest<User>('POST', '/user', formData);
                const error = "Something went wrong!";
                setMessageType('error');
                setMessage(error);
                setIsMessageModalOpen(true);
            }

        } catch (error) {
            console.error('Error occurred while processing the form:', error);
        }
    };

    return (
        <Box width="100%">
            <Form
                schema={userSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                liveValidate
                validator={validator}
            >
                <Box mt={4}>
                    <Button type="submit" colorScheme="teal">
                        Submit
                    </Button>
                </Box>
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

export default UserForm;