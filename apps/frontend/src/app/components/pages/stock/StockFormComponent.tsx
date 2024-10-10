import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { createStockSchema } from "./stock-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { Stock } from "@/app/types/stock";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { Warehouse } from "@/app/types/warehouse";
import { Product } from "@/app/types/product";
import { handleResponse } from "@/app/utils/handle-api-response";

interface StockFormProps {
    initialData?: Stock;
}

const uiSchema = {
    quantity: {
        "ui:widget": "updown"
    }, id: {
        "ui:widget": "hidden"
    }
};

const StockForm: React.FC<StockFormProps> = ({ initialData }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const router = useRouter();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await makeRequest<Product[]>('GET', '/product');
                setProducts(productsResponse.data);

                const warehousesResponse = await makeRequest<Warehouse[]>('GET', '/warehouse');
                setWarehouses(warehousesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const id = initialData?.id ?? '';
    const stockSchema = createStockSchema(products, warehouses, id);

    const handleCancel = () => {
        router.push('/stock');
    }

    const handleSubmit = async (data: IChangeEvent<Stock>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<Stock>('PATCH', `/stock/${formData.id}`, formData);
            } else {
                response = await makeRequest<Stock>('POST', '/stock', { ...formData, id: undefined });
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
                {initialData ? 'Edit Stock Record' : 'Add Stock Record'}
            </Heading>
            <Form
                schema={stockSchema}
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
                onClose={() => setIsMessageModalOpen(false)}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default StockForm;