'use client';

import React from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import OrderLineDetailViewComponent from "@/app/components/pages/order-line/OrderLineViewComponent";

export default function ViewOrderLine() {
    const router = useRouter();
    const { slug:orderLineId } = router.query;

    if (!orderLineId) {
        return <Loading />
    }

    return (
        <OrderLineDetailViewComponent orderLineId={orderLineId as string} />
    );
}