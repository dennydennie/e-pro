import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { Order } from "@/app/types/order";
import { orderSchema } from "./order-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";

interface OrderFormProps {
    initialData?: Order;
}

const uiSchema = {
    customerId: {
        "ui:widget": "text"
    },
    id: {
        "ui:widget": "hidden" 
    },
    orderDate: {
        "ui:widget": "date"
    },
    expectedDeliveryDate: {
        "ui:widget": "date"
    },
    notes: {
        "ui:widget": "textarea"
    },
    nature: {
        "ui:widget": "text"
    },
    status: {
        "ui:widget": "select",
        "ui:placeholder": "Select a status",
        "ui:options": {
            enumOptions: [
                { value: "pending", label: "Pending" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" }
            ]
        }
    }
};

const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');

    if (!!initialData) {
        orderSchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<Order>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (!!formData.id) {
                response = await makeRequest<Order>('PUT', `/order/${formData.id}`, formData);
                const success = "The operation was successful!";
                setMessageType('success');
                setMessage(success);
                setIsMessageModalOpen(true);
            } else {
                response = await makeRequest<Order>('POST', '/order', formData);
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
                schema={orderSchema}
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

export default OrderForm;