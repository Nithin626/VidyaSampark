//src\app\admin\(protected)\Overview\overview-client.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Interface definitions remain the same
interface Stats {
  totalEnquiries: number;
  todayEnquiries: number;
  callsToday: number;
  totalRegisteredUsers: number;
}
interface ChartData {
    date: string;
    count: number;
}
interface OverviewClientProps {
    stats: Stats;
    chartData: ChartData[];
}

const OverviewClient: React.FC<OverviewClientProps> = ({ stats, chartData }) => {
  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 bg-blue-100 text-blue-800 rounded-md">
            {/* Added h-10 for fixed height */}
            <p className="text-sm h-10">Total Student Enquiries</p>
            <p className="text-2xl font-bold">{stats.totalEnquiries}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-purple-100 text-purple-800 rounded-md">
            {/* Added h-10 for fixed height */}
            <p className="text-sm h-10">Total Students Registered</p>
            <p className="text-2xl font-bold">{stats.totalRegisteredUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-green-100 text-blue-800 rounded-md">
            {/* Added h-10 for fixed height */}
            <p className="text-sm h-10">Registered Today</p>
            <p className="text-2xl font-bold">{stats.todayEnquiries}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-yellow-100 text-purple-800 rounded-md">
            {/* Added h-10 for fixed height */}
            <p className="text-sm h-10">Calls Made Today</p>
            <p className="text-2xl font-bold">{stats.callsToday}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart (no change here) */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Daily Enquiries (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default OverviewClient;