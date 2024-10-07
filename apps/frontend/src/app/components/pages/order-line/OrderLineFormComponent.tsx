import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { orderLineSchema } from "./order-line-schema";
import { OrderLine } from "@/app/types/order-line";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";

interface OrderLineFormProps {
    initialData?: OrderLine;
}

const uiSchema = {
    orderId: {
        "ui:widget": "text"
    },
    productId: {
        "ui:widget": "text"
    },
    quantity: {
        "ui:widget": "updown"
    },    id: {
        "ui:widget": "hidden" 
    }
};

const OrderLineForm: React.FC<OrderLineFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        orderLineSchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<OrderLine>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (!!formData.id) {
                response = await makeRequest<OrderLine>('PUT', `/order-line/${formData.id}`, formData);
                const success = "The operation was successful!";
                setMessageType('success');
                setMessage(success);
                setIsMessageModalOpen(true);
            } else {
                response = await makeRequest<OrderLine>('POST', '/order-line', formData);
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
                schema={orderLineSchema}
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

export default OrderLineForm;