import React, { useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { factorySchema } from "./factory-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Factory } from "@/app/types/factory";
import makeRequest from "@/app/services/backend";
import { Customer } from "@/app/types/customer";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";

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
        "ui:widget": "updown"
    },
    longitude: {
        "ui:widget": "updown"
    },
    userId: {
        "ui:widget": "text"
    }, id: {
        "ui:widget": "hidden"
    }
};

const FactoryForm: React.FC<FactoryFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();

    if (!!initialData) {
        factorySchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/factory');
    }

    const handleSubmit = async (data: IChangeEvent<Factory>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Factory>('PATCH', `/factory/${formData.id}`, formData);
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
                response = await makeRequest<Factory>('POST', '/factory', {...formData, id: undefined});
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
                onClose={() => setIsMessageModalOpen(false)}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default FactoryForm;