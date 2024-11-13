import React, { useState } from "react";
import { Box, Button, Heading, HStack, Spinner } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { rawMaterialSchema } from "./raw-material-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from 'next/navigation';

interface RawMaterialFormProps {
    initialData?: {
        id?: string;
        name: string;
        description: string;
    };
}

const uiSchema = {
    id: {
        "ui:widget": "hidden"
    },
    description: {
        "ui:widget": "textarea"
    }
};

const RawMaterialForm: React.FC<RawMaterialFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const [isLoading, setIsLoading] = useState(false);

    if (!!initialData) {
        rawMaterialSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/raw-material')
    }

    const handleSubmit = async (data: IChangeEvent<any>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        setIsLoading(true);
        const formData = data.formData;
        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest('PATCH', `/raw-material/${formData.id}`, formData);
            } else {
                response = await makeRequest('POST', '/raw-material', { ...formData, id: undefined });
            }

            const isSuccess = response.status === 200 || response.status === 201;
            setMessageType(isSuccess ? 'success' : 'error');
            setMessage(isSuccess ? "The operation was successful!" : "Something went wrong!");
            setIsMessageModalOpen(true);

        } catch (error) {
            console.error('Error occurred while processing the form:', error);
            setMessageType('error');
            setMessage("An error occurred while saving the raw material");
            setIsMessageModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Raw Material' : 'Add Raw Material'}
            </Heading>
            <Form
                schema={rawMaterialSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                validator={validator}
                disabled={isLoading}
            >
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

export default RawMaterialForm;