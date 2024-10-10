'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Product } from "@/app/types/product";
import ProductForm from "@/app/components/pages/product/ProductFormComponent";
import { OrderLine, OrderLineSummary } from "@/app/types/order-line";
import OrderLineForm from "@/app/components/pages/order-line/OrderLineFormComponent";

export default function EditOrderLine() {
    const router = useRouter();
    const { slug: orderLineId } = router.query;
    const [initialData, setInitialData] = useState<OrderLineSummary | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (orderLineId) {
                try {
                    const data: OrderLineSummary = (await makeRequest<OrderLineSummary>('GET', `/order-line/${orderLineId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProduct();
    }, [orderLineId]);

    if (loading) {
        return <Loading />;
    }

    return <OrderLineForm initialData={initialData} orderId={initialData?.orderId!} />;
}