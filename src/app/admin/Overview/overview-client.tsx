"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Define the types for the props we are receiving from the server component
interface Stats {
  total: number;
  today: number;
  callsToday: number;
  //admissionsToday: number;
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
            <p className="text-sm">Total Students</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-green-100 text-green-800 rounded-md">
            <p className="text-sm">Registered Today</p>
            <p className="text-2xl font-bold">{stats.today}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
            <p className="text-sm">Calls Made Today</p>
            <p className="text-2xl font-bold">{stats.callsToday}</p>
          </CardContent>
        </Card>
        
        {/* --- "Admissions Today" Card COMMENTED OUT --- */}
        {/*
        <Card>
          <CardContent className="p-4 bg-purple-100 text-purple-800 rounded-md">
            <p className="text-sm">Admissions Today</p>
            <p className="text-2xl font-bold">{stats.admissionsToday}</p>
          </CardContent>
        </Card>
        */}
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">User Growth (Last 7 Days)</h2>
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