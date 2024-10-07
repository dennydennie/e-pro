import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { productSchema } from "./product-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Product } from "@/app/types/product";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";

interface ProductFormProps {
    initialData?: Product;
}

const uiSchema = {
    name: {
        "ui:widget": "text"
    },
    description: {
        "ui:widget": "textarea"
    },
    price: {
        "ui:widget": "updown"
    },
    unit: {
        "ui:widget": "select",
        "ui:placeholder": "Select a unit",
        "ui:options": {
            enumOptions: [
                { value: "kg", label: "Kilograms" },
                { value: "L", label: "Liters" }
            ]
        }
    },
    mass: {
        "ui:widget": "updown"
    },
    volume: {
        "ui:widget": "updown"
    },
    dimensions: {
        "ui:widget": "text"
    },
    expiryDate: {
        "ui:widget": "date"
    }, id: {
        "ui:widget": "hidden"
    }
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();

    if (!!initialData) {
        productSchema.properties.id.default = initialData?.id as string;
    }

    const handleSubmit = async (data: IChangeEvent<Product>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== '') {
                response = await makeRequest<Product>('PATCH', `/product/${formData.id}`, formData);
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
                response = await makeRequest<Product>('POST', '/product', { ...formData, id: undefined });
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
        <Box width="100%">
            <Form
                schema={productSchema}
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
                onClose={() => {
                    setIsMessageModalOpen(false);
                    router.push('/product')
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default ProductForm;