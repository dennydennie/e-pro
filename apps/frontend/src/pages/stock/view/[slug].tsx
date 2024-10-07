'use client';

import React from "react";
import { useRouter } from "next/router";
import StockDetailViewComponent from "@/app/components/pages/stock/StockViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewStock() {
    const router = useRouter();
    const { slug:stockId } = router.query;

    if (!stockId) {
        return <Loading />
    }

    return (
        <StockDetailViewComponent stockId={stockId as string} />
    );
}