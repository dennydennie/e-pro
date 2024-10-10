import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { OrderLine, OrderLineSummary } from "@/app/types/order-line";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { handleResponse } from "@/app/utils/handle-api-response";
import { Product } from "@/app/types/product";
import { createOrderLineSchema } from "./order-line-schema";

interface OrderLineFormProps {
    initialData?: OrderLine |OrderLineSummary;
    orderId: string;
}

const uiSchema = {
    orderId: {
        "ui:widget": "hidden"
    },
    quantity: {
        "ui:widget": "updown"
    }, id: {
        "ui:widget": "hidden"
    }
};

const OrderLineForm: React.FC<OrderLineFormProps> = ({ orderId, initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await makeRequest<Product[]>('GET', '/product');
                setProducts(productsResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const id = initialData?.id ?? "";
    const orderLineSchema = createOrderLineSchema(products, orderId!, id)

    const handleCancel = () => {
        router.push(`/order-lines/${orderId}`);
    }

    const handleSubmit = async (data: IChangeEvent<OrderLine>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        const formData = data.formData;
        console.log(orderId);


        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<OrderLine>('PATCH', `/order-line/${formData.id}`, formData);
            } else {
                response = await makeRequest<OrderLine>('POST', '/order-line', { ...formData, id: undefined });
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
                {initialData ? 'Edit Order Line' : 'Add Order Line'}
            </Heading>
            <Form
                schema={orderLineSchema}
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
                    handleCancel();
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default OrderLineForm;