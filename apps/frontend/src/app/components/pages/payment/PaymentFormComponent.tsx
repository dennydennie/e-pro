import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { createPaymentSchema } from "./payment-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { handleResponse } from "@/app/utils/handle-api-response";
import { Order } from "@/app/types/order";
import { Payment } from "@/app/types/payment";

interface PaymentFormProps {
    initialData?: Payment;
}

const uiSchema = {
    id: { "ui:widget": "hidden" },
    orderId: {
        "ui:widget": "select",
    },
    currency: {
        "ui:widget": "select",
    },
    amount: { "ui:widget": "updown" },
};

const PaymentForm: React.FC<PaymentFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchFormData = async () => {
            try {

                const orderResponse = await makeRequest<Order[]>('GET', '/order');
                setOrders(orderResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchFormData();
    }, []);

    const id = initialData?.id ?? "";
    const paymentSchema = createPaymentSchema(orders, id);

    const handleCancel = () => {
        router.push('/order');
    };

    const handleAfterSave = () => {
        router.push(`/payment/view/${id}`);
    }

    const handleSubmit = async (data: IChangeEvent<Payment>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Payment>('PATCH', `/payment/${formData.id}`, formData);
            } else {
                response = await makeRequest<Payment>('POST', '/payment', { ...formData, id: undefined });
            }

            handleResponse(response.status, setMessage, setMessageType, setIsMessageModalOpen);

        } catch (error: any) {
            console.error('Error occurred while processing the form:', error);
            const errorMessage = `Error: ${error.message}`;
            setMessageType('error');
            setMessage(errorMessage);
            setIsMessageModalOpen(true);
        }
    };

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Payment' : 'Add Payment'}
            </Heading>
            <Form
                schema={paymentSchema}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
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
                onClose={() => {
                    setIsMessageModalOpen(false);
                    handleAfterSave();
                }
                }
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default PaymentForm;