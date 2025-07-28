//src\components\Auth\SignIn\index.tsx
"use client";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { useUI } from "@/context/UIContext"; // --- 1. Import useUI ---

const Signin = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { switchToSignUp } = useUI(); // --- 2. Get the switchToSignUp function ---

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Login successful");
      setLoading(false);
      onClose();
      // No need to push to "/", the page will auto-refresh
    }
  };

  return (
    <>
      <div className="mb-10 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>
      <form onSubmit={loginUser}>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className="w-full rounded-md border border-black/20 bg-transparent px-5 py-3 text-base outline-none focus:border-primary"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="w-full rounded-md border border-black/20 bg-transparent px-5 py-3 text-base outline-none focus:border-primary"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="bg-primary w-full py-3 rounded-lg text-lg font-medium border border-primary text-white hover:bg-primary/90"
          >
            Sign In {loading && <Loader />}
          </button>
        </div>
      </form>
      <p className="text-body-secondary text-base">
        Not a member yet?{" "}
        {/* --- 3. Use a button that calls switchToSignUp --- */}
        <button onClick={switchToSignUp} className="pl-2 text-primary hover:underline font-semibold">
          Sign Up
        </button>
      </p>
    </>
  );
};

export default Signin;