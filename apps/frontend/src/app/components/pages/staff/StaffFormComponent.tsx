import React, { useState } from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { factoryStaffSchema } from "./staff-schema";
import { FactoryStaff } from "@/app/types/factory-staff";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";

interface FactoryStaffFormProps {
    initialData?: FactoryStaff;
}

const uiSchema = {
    userId: {
        "ui:widget": "text"
    },
    factoryId: {
        "ui:widget": "text"
    },
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

    if (!!initialData) {
        factoryStaffSchema.properties.id.default = initialData?.id as string;
    }

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

            if (formData.id !== "") {
                response = await makeRequest<FactoryStaff>('PATCH', `/factory-staff/${formData.id}`, formData);
                const success = "The operation was successful!";
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
                response = await makeRequest<FactoryStaff>('POST', '/factory-staff', {...formData, id: undefined});
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
             <Heading my={4}>Add Product</Heading>
            <Form
                schema={factoryStaffSchema}
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

export default FactoryStaffForm;