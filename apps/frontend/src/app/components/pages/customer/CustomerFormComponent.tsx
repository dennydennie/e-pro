import React, { useState } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { Customer } from "@/app/types/customer";
import { customerSchema } from "./customer-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from 'next/navigation';

interface CustomerFormProps {
    initialData?: Customer;
}

const uiSchema = {
    contactPersonMobile: {
        "ui:options": {
            "inputType": "tel"
        }
    },
    shippingLatitude: {
        "ui:widget": "text",
    },
    shippingLongitude: {
        "ui:widget": "text",
    }, id: {
        "ui:widget": "hidden"
    }
};

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        customerSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/customer')
    }

    const handleSubmit = async (data: IChangeEvent<Customer>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;
        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Customer>('PATCH', `/customer/${formData.id}`, formData);
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
                response = await makeRequest<Customer>('POST', '/customer', { ...formData, id: undefined });
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
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Customer' : 'Add Customer'}
            </Heading>
            <Form
                schema={customerSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                validator={validator}            >
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

export default CustomerForm;