import React, { useEffect, useState } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv8';
import { Customer } from "@/app/types/customer";
import makeRequest from "@/app/services/backend";
import { IChangeEvent } from "@rjsf/core";
import { useRouter } from "next/router";

interface ReportFormData {
    reportType: string;
    startDate: string;
    endDate: string;
    customerId?: string;
}

const ReportForm: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
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

    const schema = {
        type: "object",
        required: ["reportType", "startDate", "endDate"],
        properties: {
            reportType: {
                type: "string",
                title: "Report Type",
                enum: ["stocks", "delivery_note", "orders", "payments"],
                enumNames: ["Stocks Report", "Delivery Note", "Orders Report", "Payments Report"]
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
            }
        }
    };

    const uiSchema = {
        reportType: {
            "ui:widget": "select",
            "ui:placeholder": "Select report type"
        },
        startDate: {
            "ui:widget": "date"
        },
        endDate: {
            "ui:widget": "date"
        },
        customerId: {
            "ui:widget": "select",
            "ui:placeholder": "Select customer",
            "ui:options": {
                dependencies: ["reportType"]
            },
            "ui:hidden": (formData: ReportFormData) => formData.reportType !== "delivery_note"
        }
    };

    const handleSubmit = async (data: IChangeEvent<ReportFormData>) => {
        if (!data.formData) return;
        
        try {
            // Here you would handle the report generation
            // For example:
            await makeRequest('POST', '/reports/generate', data.formData);
            // Handle success (maybe download the report or show a success message)
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
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                onSubmit={handleSubmit}
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
                <Button ml={"8"}width={"30%"}colorScheme="red" mt={4} onClick={()=> router.back()}>
                    Cancel
                </Button>
            </Form>
        </Box>
    );
};

export default ReportForm;
