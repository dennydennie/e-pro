import React, { useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { stockThresholdSchema } from "./stock-threshold-schema";
import { StockThreshold } from "@/app/types/stock-threshold";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";

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
    const router = useRouter();

    if (!!initialData) {
        stockThresholdSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/stock-threshold');
    }

    const handleSubmit = async (data: IChangeEvent<StockThreshold>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<StockThreshold>('PATCH', `/stock-threshold/${formData.id}`, formData);
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
                response = await makeRequest<StockThreshold>('POST', '/stock-threshold', {...formData, id: undefined});
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
             <Heading my={4}>Add Stock Threshold</Heading>
            <Form
                schema={stockThresholdSchema}
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
                    <Button colorScheme="red" onClick={handleCancel } aria-label="Cancel action">
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

export default StockThresholdForm;