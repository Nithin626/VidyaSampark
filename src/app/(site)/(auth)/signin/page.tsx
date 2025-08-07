
'use client'; 
import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";

export default function SignInPage() {
  const handleClose = () => {}; 

  return (
    <>
      <Breadcrumb pageName="Sign In Page" />
      {/* required prop */}
      <Signin onClose={handleClose} /> 
    </>
  );
};