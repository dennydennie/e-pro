import React, { useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { productSchema } from "./product-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Product } from "@/app/types/product";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/navigation";
import { handleResponse } from "@/app/utils/handle-api-response";

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
        "ui:widget": "date",
        "ui:options": {
            min: new Date().toISOString().split('T')[0]
        }
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

    const handleCancel = () => {
        router.push('/product');
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
            } else {
                response = await makeRequest<Product>('POST', '/product', { ...formData, id: undefined });
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
                {initialData ? 'Edit Product' : 'Add Product'}
            </Heading>
            <Form
                schema={productSchema}
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
                    router.push('/product')
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default ProductForm;