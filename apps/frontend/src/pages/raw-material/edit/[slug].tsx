'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import RawMaterialForm from "@/app/components/pages/raw-material/RawMaterialFormComponent";
import { RawMaterial } from "@/app/components/pages/raw-material/RawMaterialListComponent";

export default function EditRawMaterial() {
    const router = useRouter();
    const { slug } = router.query;
    const [initialData, setInitialData] = useState<RawMaterial | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchRawMaterial = async () => {
            if (slug) {
                try {
                    const data: RawMaterial = (await makeRequest<RawMaterial>('GET', `/raw-material/${slug}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching raw material:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRawMaterial();
    }, [slug]);

    if (loading) {
        return <Loading />;
    }

    return <RawMaterialForm initialData={initialData} />;
}