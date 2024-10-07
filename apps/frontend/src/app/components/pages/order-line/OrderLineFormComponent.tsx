import React, { useState } from "react";
import { Box, Button, HStack , Heading} from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { orderLineSchema } from "./order-line-schema";
import { OrderLine } from "@/app/types/order-line";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";

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
    }, id: {
        "ui:widget": "hidden"
    }
};

const OrderLineForm: React.FC<OrderLineFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();

    if (!!initialData) {
        orderLineSchema.properties.id.default = initialData?.id as string;
    }

    const handleCancel = () => {
        router.push('/order');
    }

    const handleSubmit = async (data: IChangeEvent<OrderLine>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<OrderLine>('PATCH', `/order-line/${formData.id}`, formData);
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
                response = await makeRequest<OrderLine>('POST', '/order-line', {...formData, id: undefined});
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
            <Heading my={4}>Add Order Line </Heading>
            <Form
                schema={orderLineSchema}
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

export default OrderLineForm;