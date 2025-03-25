"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import BookerDashboard from "@/components/dashboard/BookerDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const DashboardPage = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated || !user) {
        return <LoadingSpinner />;
    }

    switch (user.accountType) {
        case "admin":
            return <AdminDashboard user={user} />;
        case "booker":
            return <BookerDashboard user={user} />;
        case "owner":
            return <OwnerDashboard user={user} />;
        default:
            return null;
    }
};

export default DashboardPage;