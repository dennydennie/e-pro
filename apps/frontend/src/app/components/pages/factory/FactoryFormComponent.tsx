import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { factorySchema } from "./factory-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Factory } from "@/app/types/factory";
import makeRequest from "@/app/services/backend";
import { Customer } from "@/app/types/customer";
import MessageModal from "../../shared/MessageModal";

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
    },    id: {
        "ui:widget": "hidden" 
    }
};

const FactoryForm: React.FC<FactoryFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        factorySchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<Factory>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (!!formData.id) {
                response = await makeRequest<Factory>('PUT', `/factory/${formData.id}`, formData);
                const success = "The operation was successful!";
                setMessageType('success');
                setMessage(success);
                setIsMessageModalOpen(true);
            } else {
                response = await makeRequest<Factory>('POST', '/factory', formData);
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
                schema={factorySchema}
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

export default FactoryForm;