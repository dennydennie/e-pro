'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import PriceForm from "@/app/components/pages/price/PriceFormComponent";
import { PriceForm as Price    } from "@/app/components/pages/price/PriceListComponent";
export default function EditPrice() {
    const router = useRouter();
    const { slug } = router.query;
    const [initialData, setInitialData] = useState<Price | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPrice = async () => {
            if (slug) {
                try {
                    const data: Price = (await makeRequest<Price>('GET', `/price/${slug}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching price:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPrice();
    }, [slug]);

    if (loading) {
        return <Loading />;
    }

    return initialData ? <PriceForm initialData={initialData} /> : null;
}