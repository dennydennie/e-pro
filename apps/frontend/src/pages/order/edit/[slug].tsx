'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Order } from "@/app/types/order";
import OrderForm from "@/app/components/pages/order/OrderFormComponent";

export default function EditOrder() {
    const router = useRouter();
    const { slug:orderId } = router.query;
    const [initialData, setInitialData] = useState<Order | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                try {
                    const data: Order = await makeRequest<Order>('GET', `/order/${orderId}`);
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching order:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <Loading />;
    }

    return <OrderForm initialData={initialData} />;
}