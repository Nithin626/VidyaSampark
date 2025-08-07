
'use client'; 

import SignUp from "@/components/Auth/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
export default function SignUpPage() {
  const handleClose = () => {}; 

  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />
      {/* required onClose prop */}
      <SignUp onClose={handleClose} /> 
    </>
  );
};