import React, { useEffect, useState } from "react";
import { Box, Button, HStack, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import { StockThreshold } from "@/app/types/stock-threshold";
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from "next/router";
import { Product } from "@/app/types/product";
import { Warehouse } from "@/app/types/warehouse";
import { handleResponse } from "@/app/utils/handle-api-response";
import { createStockThresholdSchema } from "./stock-threshold-schema";

interface StockThresholdFormProps {
    initialData?: StockThreshold;
}

const uiSchema = {
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
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData]= useState<StockThreshold | undefined>(initialData);

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
    const stockThresholdSchema = createStockThresholdSchema(products, warehouses, id);

    const handleCancel = () => {
        router.push('/threshold');
    }

    const handleSubmit = async (data: IChangeEvent<StockThreshold>, event: React.FormEvent<HTMLFormElement>) => {

        if (!data.formData) {
            return;
        }

        const formData = data.formData;

        console.log(formData)

        try {
            let response;

            if (formData.id !== "") {
                response = await makeRequest<StockThreshold>('PATCH', `/stock-threshold/${formData.id}`, formData);
            } else {
                response = await makeRequest<StockThreshold>('POST', '/stock-threshold', { ...formData, id: undefined });
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
                {initialData ? 'Edit Threshold' : 'Add Threshold'}
            </Heading>
            <Form
                schema={stockThresholdSchema}
                uiSchema={uiSchema}
                formData={formData}
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

export default StockThresholdForm;