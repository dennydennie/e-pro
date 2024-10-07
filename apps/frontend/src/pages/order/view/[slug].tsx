'use client';

import React from "react";
import { useRouter } from "next/router";
import OrderDetailViewComponent from "@/app/components/pages/order/OrderViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewOrder() {
    const router = useRouter();
    const { slug:orderId } = router.query;

    if (!orderId) {
        return <Loading />;
    }

    return (
        <OrderDetailViewComponent orderId={orderId as string} />
    );
}