'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { StockThreshold } from "@/app/types/stock-threshold";
import StockThresholdForm from "@/app/components/pages/stock-threshold/StockThresholdFormComponent";

export default function EditStockThreshold() {
    const router = useRouter();
    const { slug:stockThresholdId } = router.query;
    const [initialData, setInitialData] = useState<StockThreshold | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockThreshold = async () => {
            if (stockThresholdId) {
                try {
                    const data: StockThreshold = await makeRequest<StockThreshold>('GET', `/stock-threshold/${stockThresholdId}`);
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching stock threshold:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStockThreshold();
    }, [stockThresholdId]);

    if (loading) {
        return <Loading />;
    }

    return <StockThresholdForm initialData={initialData} />;
}