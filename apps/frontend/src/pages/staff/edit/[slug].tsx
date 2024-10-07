'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";
import makeRequest from "@/app/services/backend";
import FactoryStaffForm from "@/app/components/pages/staff/StaffFormComponent";
import { FactoryStaff } from "@/app/types/factory-staff";

export default function EditFactoryStaff() {
    const router = useRouter();
    const { slug:factoryStaffId } = router.query;
    const [initialData, setInitialData] = useState<FactoryStaff | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFactoryStaff = async () => {
            if (factoryStaffId) {
                try {
                    const data: FactoryStaff = (await makeRequest<FactoryStaff>('GET', `/factory-staff/${factoryStaffId}`)).data;
                    setInitialData(data);
                } catch (error) {
                    console.error('Error fetching factory staff:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFactoryStaff();
    }, [factoryStaffId]);

    if (loading) {
        return <Loading />;
    }

    return <FactoryStaffForm initialData={initialData} />;
}