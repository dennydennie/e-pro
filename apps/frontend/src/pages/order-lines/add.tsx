'use client';

import OrderLineForm from "@/app/components/pages/order-line/OrderLineFormComponent";
import React from "react";
import { useRouter } from "next/router";

export default function CreateOrderLine() {
    const router = useRouter();
    const { orderId } = router.query;

    return <OrderLineForm orderId={orderId as string} />;
}