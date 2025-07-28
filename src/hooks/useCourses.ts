"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function useCourses(limit = 8) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .limit(limit);

      if (!error) setCourses(data || []);
      setLoading(false);
    };

    fetchCourses();
  }, [limit]);

  return { courses, loading };
}
