import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { Order } from "@/app/types/order";
import { createOrderSchema } from "./order-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { Customer } from "@/app/types/customer";
import { handleResponse } from "@/app/utils/handle-api-response";
import CustomDateWidget from "../../shared/CustomDateWidget";

interface OrderFormProps {
    initialData?: Order;
}

const uiSchema = {
    id: { "ui:widget": "hidden" },
    orderDate: { "ui:widget": "date" },
    expectedDeliveryDate: { "ui:widget": "date", "ui:options": { minDate: "orderDate" } },
    notes: { "ui:widget": "textarea" },
    status: {
        "ui:widget": "select",
        "ui:placeholder": "Select a status",
        "ui:options": {
            enumOptions: [
                { value: "Pending", label: "Pending" },
                { value: "Shipped", label: "Shipped" },
                { value: "Delivered", label: "Delivered" },
                { value: "Cancelled", label: "Cancelled" }
            ]
        }
    }
};

const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState<Order | undefined>(initialData);

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                const response = await makeRequest<Customer[]>('GET', '/customer');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchFormData();
    }, []);

    const id = initialData?.id ?? "";
    const orderSchema = createOrderSchema(customers, id);

    const handleCancel = () => {
        router.push('/order');
    };

    const handleSubmit = async (data: IChangeEvent<Order>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;
        setFormData(formData);


        if (new Date(formData.expectedDeliveryDate) < new Date(formData.orderDate)) {
            setMessageType('error');
            setMessage('Expected delivery date must be on or after the order date');
            setIsMessageModalOpen(true);
            return;
        }

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Order>('PATCH', `/order/${formData.id}`, formData);
            } else {
                response = await makeRequest<Order>('POST', '/order', { ...formData, id: undefined });
            }

            handleResponse(response.status, setMessage, setMessageType, setIsMessageModalOpen);

            if (response.status === 200 || response.status === 201) {
                const orderId = response.data.id || formData.id;
                router.push(`/order-lines/${orderId}`);
            }

        } catch (error: any) {
            console.error('Error occurred while processing the form:', error);
            const errorMessage = `Error: ${error.message}`;
            setMessageType('error');
            setMessage(errorMessage);
            setIsMessageModalOpen(true);
        }
    };
    const customWidgets = { DateWidget: CustomDateWidget };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Order' : 'Add Order'}
            </Heading>
            <Form
                schema={orderSchema}
                uiSchema={uiSchema}
                formData={formData}
                onSubmit={handleSubmit}
                validator={validator}
                widgets={customWidgets}
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

export default OrderForm;