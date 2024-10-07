import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { stockThresholdSchema } from "./stock-threshold-schema";
import { StockThreshold } from "@/app/types/stock-threshold";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";

interface StockThresholdFormProps {
    initialData?: StockThreshold;
}

const uiSchema = {
    productId: {
        "ui:widget": "text"
    },
    warehouseId: {
        "ui:widget": "text"
    },
    lowStockThreshold: {
        "ui:widget": "updown"
    },
    highStockThreshold: {
        "ui:widget": "updown"
    },
    id: {
        "ui:widget": "hidden" 
    }
};

const StockThresholdForm: React.FC<StockThresholdFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        stockThresholdSchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<StockThreshold>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (!!formData.id) {
                response = await makeRequest<StockThreshold>('PUT', `/stock-threshold/${formData.id}`, formData);
                const success = "The operation was successful!";
                setMessageType('success');
                setMessage(success);
                setIsMessageModalOpen(true);
            } else {
                response = await makeRequest<StockThreshold>('POST', '/stock-threshold', formData);
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
                schema={stockThresholdSchema}
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

export default StockThresholdForm;