'use client';

import React from "react";
import { useRouter } from "next/router";
import Loading from "@/app/components/shared/Loading";

export default function ViewStaff() {
    const router = useRouter();
    const { slug:staffId } = router.query;

    if (!staffId) {
        return <Loading />
    }

    return (
        <FactoryStaffDetailViewComponent staffId={staffId as string} />
    );
}