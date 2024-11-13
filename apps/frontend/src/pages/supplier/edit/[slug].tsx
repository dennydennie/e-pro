'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import { Supplier } from "@/app/components/pages/supplier/SupplierListComponent";
import SupplierForm from "@/app/components/pages/supplier/SupplierFormComponent";

export default function EditSupplier() {    
    const router = useRouter();
    const { slug } = router.query;
    const [initialData, setInitialData] = useState<Supplier | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchSupplier = async () => {
            if (slug) {
                try {
                    const data: Supplier = (await makeRequest<Supplier>('GET', `/supplier/${slug}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching supplier:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSupplier();
    }, [slug]);

    if (loading) {
        return <Loading />;
    }

    return <SupplierForm initialData={initialData} />;
}