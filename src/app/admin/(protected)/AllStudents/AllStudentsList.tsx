//src\app\admin\(protected)\AllStudents\AllStudentsList.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { updateProfileRemarkAction } from "../../actions";

// Define the type for a user profile
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_class?: string | null;
  admin_remark?: string | null;
}

export default function AllStudentsList({ profiles }: { profiles: UserProfile[] }) {
  const [remarks, setRemarks] = useState<Record<string, string>>(() => {
    const remarkMap: Record<string, string> = {};
    profiles.forEach((p) => {
      remarkMap[p.id] = p.admin_remark || "";
    });
    return remarkMap;
  });

  const handleRemarkSave = async (profileId: string) => {
    const remark = remarks[profileId];
    const result = await updateProfileRemarkAction(profileId, remark);

    if (result.success) {
      toast.success(result.success);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const exportToExcel = () => {
    const formattedData = profiles.map((p) => ({
      Name: p.name || "N/A",
      Phone: p.phone || "N/A",
      Email: p.email || "N/A",
      "Current Class": p.current_class || "N/A",
      Remark: remarks[p.id] || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Students");
    XLSX.writeFile(workbook, "all-students.xlsx");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">All Registered Students</h1>
        <Button onClick={exportToExcel}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Class</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600 w-[300px]">Admin Remark</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{profile.name || "-"}</td>
                <td className="px-4 py-2 border-b">{profile.phone || "-"}</td>
                <td className="px-4 py-2 border-b">{profile.email || "-"}</td>
                <td className="px-4 py-2 border-b">{profile.current_class || "-"}</td>
                <td className="px-4 py-2 border-b">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    value={remarks[profile.id] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [profile.id]: e.target.value,
                      }))
                    }
                    placeholder="Enter remark for outreach..."
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleRemarkSave(profile.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}