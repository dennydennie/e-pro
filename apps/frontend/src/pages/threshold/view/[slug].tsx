'use client';

import React from "react";
import { useRouter } from "next/router";
import StockThresholdDetailViewComponent from "@/app/components/pages/stock-threshold/StockThresholdViewComponent";
import Loading from "@/app/components/shared/Loading";

export default function ViewStockThreshold() {
    const router = useRouter();
    const { slug:stockThresholdId } = router.query;

    if (!stockThresholdId) {
        return <Loading />
    }

    return (
        <StockThresholdDetailViewComponent stockThresholdId={stockThresholdId as string} />
    );
}