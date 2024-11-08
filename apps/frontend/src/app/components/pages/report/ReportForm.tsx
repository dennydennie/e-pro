/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv8';
import { Customer } from "@/app/types/customer";
import makeRequest from "@/app/services/backend";
import { IChangeEvent } from "@rjsf/core";
import { useRouter } from "next/router";
import { Order } from "@/app/types/order";

interface ReportFormData {
    reportType: string;
    startDate: string;
    endDate: string;
    customerId?: string;
    orderId?: string;
}

const ReportForm: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customerId, setCustomerId] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await makeRequest<Customer[]>('GET', '/customer');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchOrders = async (customerId: string) => {
            try {
                const response = await makeRequest<Order[]>('GET', `/order/customer/${customerId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (!formData.customerId) {
            setOrders([]);
            return;
        }
        fetchOrders(customerId!);
    }, [customerId]);

    const schemas = {
        stocks: {
            type: "object",
            required: ["reportType", "startDate", "endDate"],
            properties: {
                reportType: {
                    type: "string",
                    title: "Report Type",
                    enum: ["stocks"],
                    enumNames: ["Stocks Report"]
                },
                startDate: {
                    type: "string",
                    title: "Start Date",
                    format: "date"
                },
                endDate: {
                    type: "string",
                    title: "End Date",
                    format: "date"
                }
            }
        },
        delivery_note: {
            type: "object",
            required: ["reportType", "startDate", "endDate", "customerId", "orderId"],
            properties: {
                reportType: {
                    type: "string",
                    title: "Report Type",
                    enum: ["delivery_note"],
                    enumNames: ["Delivery Note"]
                },
                startDate: {
                    type: "string",
                    title: "Start Date",
                    format: "date"
                },
                endDate: {
                    type: "string",
                    title: "End Date",
                    format: "date"
                },
                customerId: {
                    type: "string",
                    title: "Customer",
                    enum: customers.map(c => c.id),
                    enumNames: customers.map(c => c.name)
                },
                orderId: {
                    type: "string",
                    title: "Order",
                    enum: orders.map(o => o.id),
                    enumNames: orders.map(o => `${o.orderDate} - ${o.notes}`)
                }
            }
        },
    };

    const uiSchemas = {
        stocks: {
            startDate: {
                "ui:widget": "date"
            },
            endDate: {
                "ui:widget": "date"
            }
        },
        delivery_note: {
            startDate: {
                "ui:widget": "date"
            },
            endDate: {
                "ui:widget": "date"
            },
            customerId: {
                "ui:widget": "select",
                "ui:placeholder": "Select customer"
            },
            orderId: {
                "ui:widget": "select",
                "ui:placeholder": "Select order"
            }
        },
    };

    const initialSchema = {
        type: "object",
        required: ["reportType"],
        properties: {
            reportType: {
                type: "string",
                title: "Report Type",
                enum: ["stocks", "delivery_note", "orders", "payments"],
                enumNames: ["Stocks Report", "Delivery Note", "Orders Report", "Payments Report"]
            }
        }
    };

    const initialUiSchema = {
        reportType: {
            "ui:widget": "select",
            "ui:placeholder": "Select report type"
        }
    };

    const getCurrentSchema = () => {
        if (!formData.reportType) return initialSchema;
        return schemas[formData.reportType as keyof typeof schemas] || initialSchema;
    };

    const getCurrentUiSchema = () => {
        if (!formData.reportType) return initialUiSchema;
        return uiSchemas[formData.reportType as keyof typeof uiSchemas] || initialUiSchema;
    };

    const [formData, setFormData] = useState<ReportFormData>({
        reportType: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e: IChangeEvent<ReportFormData>) => {
        console.log(e);
        const newFormData = e.formData || {
            reportType: '',
            startDate: '',
            endDate: '',
        };
        setFormData(newFormData);
        setCustomerId(newFormData.customerId);
    };

    const handleSubmit = async (data: IChangeEvent<ReportFormData>) => {
        if (!data.formData) return;

        try {
            const response = await makeRequest<Blob>('POST', '/report/generate', data.formData, { responseType: 'blob' });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `report-${data.formData.reportType}-${new Date().toISOString()}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    return (
        <Box width="50%" py={8}>
            <Heading fontSize={'2xl'} mb={6}>
                Generate Report
            </Heading>
            <Form
                schema={getCurrentSchema()}
                uiSchema={getCurrentUiSchema()}
                validator={validator}
                onSubmit={handleSubmit}
                onChange={handleChange}
                formData={formData}
                transformErrors={(errors) => {
                    return errors.map(error => {
                        if (error.name === "required") {
                            error.message = "This field is required";
                        }
                        return error;
                    });
                }}
            >
                <Button width={"30%"} type="submit" colorScheme="blue" mt={4}>
                    Generate Report
                </Button>
                <Button ml={"8"} width={"30%"} colorScheme="red" mt={4} onClick={() => router.back()}>
                    Cancel
                </Button>
            </Form>
        </Box>
    );
};

export default ReportForm;
