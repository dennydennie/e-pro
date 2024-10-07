'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Warehouse } from "@/app/types/warehouse"; 
import WarehouseForm from "@/app/components/pages/warehouse/WarehouseFormComponent";

export default function EditWarehouse() {
    const router = useRouter();
    const { slug:warehouseId } = router.query;
    const [initialData, setInitialData] = useState<Warehouse | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarehouse = async () => {
            if (warehouseId) {
                try {
                    const data: Warehouse = (await makeRequest<Warehouse>('GET', `/warehouse/${warehouseId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching warehouse:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchWarehouse();
    }, [warehouseId]);

    if (loading) {
        return <Loading />;
    }

    return <WarehouseForm initialData={initialData} />;
}