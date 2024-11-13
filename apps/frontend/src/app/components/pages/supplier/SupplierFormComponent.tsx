import React, { useState } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { supplierSchema } from "./supplier-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from 'next/navigation';
import { Supplier } from "./SupplierListComponent";

interface SupplierFormProps {
    initialData?: Supplier;
}

const uiSchema = {
    contactNumber: {
        "ui:options": {
            "inputType": "tel"
        }
    },
    lat: {
        "ui:widget": "text",
    },
    lon: {
        "ui:widget": "text",
    },
    id: {
        "ui:widget": "hidden"
    },
    taxClearance: {
        "ui:placeholder": "Upload document",
        "ui:label": false
    },
    taxExpiry: {
        "ui:widget": "date"
    }
};

const SupplierForm: React.FC<SupplierFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const [isLoading, setIsLoading] = useState(false);

    if (!!initialData) {
        supplierSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/supplier')
    }

    const handleSubmit = async (data: IChangeEvent<Supplier>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        setIsLoading(true);
        const formData = data.formData;
        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Supplier>('PATCH', `/supplier/${formData.id}`, formData);
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
                response = await makeRequest<Supplier>('POST', '/supplier', { ...formData, id: undefined });
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Supplier' : 'Add Supplier'}
            </Heading>
            <Form
                schema={supplierSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                validator={validator}            >
                <HStack mt={4} spacing={8}>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={isLoading}
                        loadingText="Submitting"
                    >
                        Submit
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleCancel}
                        aria-label="Cancel action"
                        isDisabled={isLoading}
                    >
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

export default SupplierForm;