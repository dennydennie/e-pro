'use client';

import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Card, CardBody, Text, Heading, Spinner } from "@chakra-ui/react";
import makeRequest from "@/app/services/backend";
import { useSession } from "next-auth/react";
import { User } from "@/app/types/user";

const Dashboard = () => {
    const { data, status } = useSession();
    const user: User | undefined = data?.user as User;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const items = [
        { name: "Orders", endPoint: '/order' },
        { name: "Products", endPoint: '/product' },
        { name: "Stock Thresholds", endPoint: '/stock-threshold' },
        { name: "Stocks", endPoint: '/stock' },
        { name: "Users", endPoint: '/user' },
        { name: "Warehouses", endPoint: '/warehouse' },
        { name: "Factory Staff", endPoint: '/factory-staff' },
        { name: "Factories", endPoint: '/factory' },
        { name: "Customers", endPoint: '/customer' },
    ];

    const ordinaryUserItems = [
        { name: "Orders", endPoint: '/order' },
        { name: "Stocks", endPoint: '/stock' },
        { name: "Customers", endPoint: '/customer' },
        { name: "Products", endPoint: '/product' },
    ];

    const displayItems = user?.role === 'admin' ? items : ordinaryUserItems ;

    const [summaryData, setSummaryData] = useState(
        items.reduce((acc: any, item: any) => {
            acc[item.name] = 0;
            return acc;
        }, {})
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const countPromises = displayItems.map(async (item) => {
                    const response: any = await makeRequest('GET', item.endPoint);
                    return { name: item.name, count: response.data.length || 0 };
                });

                const counts = await Promise.all(countPromises);
                const updatedSummary = counts.reduce((acc: any, { name, count }) => {
                    acc[name] = count;
                    return acc;
                }, {});

                setSummaryData(updatedSummary);
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [displayItems]);

    if (loading) {
        return (
            <Box textAlign="center" mt={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <Heading size={"md"} mb={6}>Dashboard Summary</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {Object.keys(summaryData).map((key) => (
                    <Card 
                    key={key}
                    >
                        <CardBody>
                            <Heading size="md">{key}</Heading>
                            <Text fontSize="xl">{summaryData[key]}</Text>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Dashboard;