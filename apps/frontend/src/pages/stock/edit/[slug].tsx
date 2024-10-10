'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Stock } from "@/app/types/stock";
import StockForm from "@/app/components/pages/stock/StockFormComponent";

export default function EditStock() {
    const router = useRouter();
    const { slug:stockId } = router.query;
    const [initialData, setInitialData] = useState<Stock | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStock = async () => {
            if (stockId) {
                try {
                    const data: Stock = (await makeRequest<Stock>('GET', `/stock/${stockId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching stock:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStock();
    }, [stockId]);

    if (loading) {
        return <Loading />;
    }
    console.log(initialData);
    return <StockForm initialData={initialData} />;
}