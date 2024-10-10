'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Factory } from "@/app/types/factory";
import FactoryForm from "@/app/components/pages/factory/FactoryFormComponent";

export default function EditFactory() {
    const router = useRouter();
    const { slug: factoryId } = router.query;
    const [initialData, setInitialData] = useState<FactorySummary | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFactory = async () => {
            if (factoryId) {
                try {
                    const data: FactorySummary = (await makeRequest<FactorySummary>('GET', `/factory/${factoryId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching factory:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFactory();
    }, [factoryId]);

    if (loading) {
        return <Loading />;
    }

    return <FactoryForm initialData={initialData} />;
}