//src\app\admin\Overview\page.tsx
import { supabase } from "@/utils/supabaseClient";
import OverviewClient from "./overview-client";

// This tells Next.js to always fetch fresh data for this page
export const dynamic = 'force-dynamic';

async function getOverviewStats() {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    // 1. Get total count of enquiries
    const { count: totalEnquiries, error: totalError } = await supabase
        .from("enquiries")
        .select('*', { count: 'exact', head: true });

    // 2. Get count of enquiries registered today
    const { count: todayEnquiries, error: todayError } = await supabase
        .from("enquiries")
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart)
        .lt('created_at', todayEnd);

    // 3. Get count of calls made today
    const { count: callsToday, error: callsError } = await supabase
        .from("enquiries")
        .select('*', { count: 'exact', head: true })
        .eq('called', true)
        .gte('updated_at', todayStart)
        .lt('updated_at', todayEnd);
        
    // 4. Get count of admissions today (based on remark) --- COMMENTED OUT ---
    /*
    const { count: admissionsToday, error: admissionsError } = await supabase
        .from("enquiries")
        .select('*', { count: 'exact', head: true })
        .ilike('remark', '%admission%') // Case-insensitive search for "admission"
        .gte('created_at', todayStart)
        .lt('created_at', todayEnd);
    */

    if (totalError || todayError || callsError /*|| admissionsError*/) {
        console.error("Error fetching overview stats:", { totalError, todayError, callsError, /*admissionsError*/ });
    }

    // 5. Fetch data for the last 7 days for the chart
    const last7DaysPromises = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        return supabase
            .from("enquiries")
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dayStart)
            .lt('created_at', dayEnd)
            .then(({ count }) => ({
                date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
                count: count || 0
            }));
    });

    const chartData = (await Promise.all(last7DaysPromises)).reverse();

    return {
        stats: {
            total: totalEnquiries || 0,
            today: todayEnquiries || 0,
            callsToday: callsToday || 0,
            // admissionsToday: admissionsToday || 0, // --- COMMENTED OUT ---
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
