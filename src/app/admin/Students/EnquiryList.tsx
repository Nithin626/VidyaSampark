//src\app\admin\Students\EnquiryList.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { updateEnquiryCalledStatusAction, updateEnquiryRemarkAction } from "../actions";

export interface Enquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  current_class?: string;
  called?: boolean;
  remark?: string;
  courses: { name: string } | { name: string }[] | null;
  universities: { name: string } | { name: string }[] | null;
}

export default function EnquiryList({ enquiries }: { enquiries: Enquiry[] }) {
  const [studentData, setStudentData] = useState<Enquiry[]>(enquiries);
  const [remarks, setRemarks] = useState<Record<string, string>>(() => {
    const remarkMap: Record<string, string> = {};
    enquiries.forEach((s) => {
      remarkMap[s.id] = s.remark || "";
    });
    return remarkMap;
  });

  const handleCheckboxChange = async (id: string, value: boolean) => {
    setStudentData((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, called: value } : student
      )
    );
    await updateEnquiryCalledStatusAction(id, value);
  };

  const handleRemarkSave = async (id: string) => {
    const remark = remarks[id];
    const result = await updateEnquiryRemarkAction(id, remark);

    if (result.success) {
      toast.success(result.success);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const exportToExcel = () => {
    const formattedData = studentData.map((s) => ({
      Name: s.name,
      Phone: s.phone,
      Email: s.email || "",
      "Current Class": s.current_class || "",
      Course: Array.isArray(s.courses) ? s.courses[0]?.name : s.courses?.name || "N/A",
      College: Array.isArray(s.universities) ? s.universities[0]?.name : s.universities?.name || "N/A",
      Called: s.called ? "Yes" : "No",
      Remark: remarks[s.id] || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Students</h1>
        <Button onClick={exportToExcel}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {/* --- THIS IS THE RESTORED TABLE STRUCTURE --- */}
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Course</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">College</th>
              <th className="px-4 py-3 border-b text-center text-sm font-semibold text-gray-600">Called</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600 w-[250px]">Remark</th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{student.name}</td>
                <td className="px-4 py-2 border-b">{student.phone}</td>
                <td className="px-4 py-2 border-b">{Array.isArray(student.courses) ? student.courses[0]?.name : student.courses?.name || "N/A"}</td>
                <td className="px-4 py-2 border-b">{Array.isArray(student.universities) ? student.universities[0]?.name : student.universities?.name || "N/A"}</td>
                <td className="px-4 py-2 border-b text-center">
                  <input
                    type="checkbox"
                    checked={!!student.called}
                    onChange={(e) =>
                      handleCheckboxChange(student.id, e.target.checked)
                    }
                    className="h-4 w-4 rounded"
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    value={remarks[student.id] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [student.id]: e.target.value,
                      }))
                    }
                    placeholder="Enter remark"
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleRemarkSave(student.id)}
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