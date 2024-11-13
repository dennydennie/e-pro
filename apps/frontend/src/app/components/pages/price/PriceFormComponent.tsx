import React, { useState, useEffect } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import { createPriceFormSchema } from "./price-schema";
import { IChangeEvent } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';
import makeRequest from "@/app/services/backend";
import MessageModal from "../../shared/MessageModal";
import { useRouter } from 'next/navigation';
import { Supplier } from "../supplier/SupplierListComponent";
import { RawMaterial } from "../raw-material/RawMaterialListComponent";

interface PriceFormProps {
    initialData?: {
        id?: string;
        price: number;
        supplierId: string;
        rawMaterialId: string;
    };
}

const uiSchema = {
    id: {
        "ui:widget": "hidden"
    }
};

const PriceForm: React.FC<PriceFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersResponse, materialsResponse] = await Promise.all([
                    makeRequest('GET', '/supplier'),
                    makeRequest('GET', '/raw-material')
                ]);

                setSuppliers(suppliersResponse.data as Supplier[]);
                setRawMaterials(materialsResponse.data as RawMaterial[]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage('Error loading form data');
                setMessageType('error');
                setIsMessageModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        router.push('/price')
    }

    const handleSubmit = async (data: IChangeEvent<any>, event: React.FormEvent<HTMLFormElement>) => {
        if (!data.formData) {
            return;
        }

        setIsSubmitting(true);
        const formData = data.formData;
        try {
            let response;

            if (formData.id) {
                response = await makeRequest('PATCH', `/price/${formData.id}`, formData);
            } else {
                response = await makeRequest('POST', '/price', { ...formData, id: undefined });
            }

            const isSuccess = response.status === 200 || response.status === 201;
            setMessageType(isSuccess ? 'success' : 'error');
            setMessage(isSuccess ? "Price saved successfully!" : "Failed to save price!");
            setIsMessageModalOpen(true);

        } catch (error) {
            console.error('Error occurred while processing the form:', error);
            setMessageType('error');
            setMessage("An error occurred while saving the price");
            setIsMessageModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box width="50%">
            <Heading fontSize={'2xl'} my={4}>
                {initialData ? 'Edit Price' : 'Add Price'}
            </Heading>
            <Form
                schema={createPriceFormSchema(suppliers, rawMaterials, initialData?.id)}
                uiSchema={uiSchema}
                formData={initialData}
                onSubmit={handleSubmit}
                validator={validator}
            >
                <HStack mt={4} spacing={8}>
                    <Button 
                        type="submit" 
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        loadingText="Saving..."
                    >
                        Submit
                    </Button>
                    <Button 
                        colorScheme="red" 
                        onClick={handleCancel} 
                        aria-label="Cancel action"
                        isDisabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </HStack>
            </Form>
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    setIsMessageModalOpen(false);
                    if (messageType === 'success') {
                        handleCancel();
                    }
                }}
                message={message}
                type={messageType}
            />
        </Box>
    );
};

export default PriceForm;