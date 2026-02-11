import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Varmina Joyas",
    description: "Panel de administración",
};

export default function Page() {
    return <AdminDashboardView />;
}
