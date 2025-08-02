//src\app\admin\(protected)\Overview\page.tsx
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import OverviewClient from "./overview-client";

export const dynamic = 'force-dynamic';

async function getOverviewStats() {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // Fetch all stats in parallel for efficiency
    const [
        totalEnquiriesRes,
        todayEnquiriesRes,
        callsTodayRes,
        totalUsersRes
    ] = await Promise.all([
        // 1. Get total count of all enquiries ever
        supabaseAdmin.from("enquiries").select('*', { count: 'exact', head: true }),
        // 2. Get count of enquiries registered today
        supabaseAdmin.from("enquiries").select('*', { count: 'exact', head: true }).gte('created_at', todayStart).lt('created_at', todayEnd),
        // 3. Get count of calls made today
        supabaseAdmin.from("enquiries").select('*', { count: 'exact', head: true }).eq('called', true).gte('updated_at', todayStart).lt('updated_at', todayEnd),
        // 4. Get total count of all registered users
        supabaseAdmin.from("user_profiles").select('*', { count: 'exact', head: true })
    ]);

    if (totalEnquiriesRes.error || todayEnquiriesRes.error || callsTodayRes.error || totalUsersRes.error) {
        console.error("Error fetching overview stats:", {
            enquiries: totalEnquiriesRes.error,
            today: todayEnquiriesRes.error,
            calls: callsTodayRes.error,
            users: totalUsersRes.error,
        });
    }

    // Fetch chart data
    const last7DaysPromises = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        return supabaseAdmin
            .from("enquiries")
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dayStart)
            .lt('created_at', dayEnd)
            .then(({ count }) => ({
                date: date.toISOString().split('T')[0],
                count: count || 0
            }));
    });

    const chartData = (await Promise.all(last7DaysPromises)).reverse();

    return {
        stats: {
            totalEnquiries: totalEnquiriesRes.count || 0,
            todayEnquiries: todayEnquiriesRes.count || 0,
            callsToday: callsTodayRes.count || 0,
            totalRegisteredUsers: totalUsersRes.count || 0,
        },
        chartData
    };
}

export default async function OverviewPage() {
    const { stats, chartData } = await getOverviewStats();

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-xl font-bold">Dashboard Overview</h1>
            <OverviewClient stats={stats} chartData={chartData} />
        </div>
    );
}