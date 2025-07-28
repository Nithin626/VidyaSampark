//src\components\Auth\SignUp\index.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import { useState } from "react";
import Loader from "@/components/Common/Loader";
import { supabase } from "@/utils/supabaseClient";

const SignUp = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const current_class = form.get("current_class") as string;
    // --- 1. Get the phone number from the form ---
    const phone = form.get("phone") as string;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      toast.error("Signup succeeded, but no user returned.");
      setLoading(false);
      return;
    }

    // --- 2. Insert the new phone number into the user_profiles table ---
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: user.id,
          email,
          name,
          current_class,
          phone: `+91${phone}`, // Add the prefix here
        },
      ]);

    if (profileError) {
      console.error("Insert profile error:", profileError.message);
      toast.error(`Profile creation failed: ${profileError.message}`);
    } else {
      toast.success("Signup successful. Check your email.");
      onClose();
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mb-6 text-center mx-auto inline-block max-w-[160px]">
        <Logo />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none dark:focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none dark:focus:border-primary"
          />
        </div>
        
        {/* --- 3. Add the phone number input field to the form --- */}
        <div className="mb-4">
            <div className="flex items-center rounded-md border border-black/20 border-solid focus-within:border-primary">
                <span className="px-3 text-grey">+91</span>
                <input
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    required
                    pattern="[0-9]{10}" // Simple validation for 10 digits
                    title="Please enter a valid 10-digit phone number"
                    className="w-full bg-transparent py-3 text-base text-dark outline-none transition placeholder:text-grey"
                />
            </div>
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none dark:focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <select
            name="current_class"
            required
            defaultValue=""
            className="w-full rounded-md border border-black/20 border-solid bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none dark:focus:border-primary"
          >
            <option value="" disabled>
              Select Current Class
            </option>
            <option value="Class 10">Class 10</option>
            <option value="Class 12">Class 12</option>
            <option value="Degree">Degree</option>
          </select>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="flex w-full items-center text-18 font-medium justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border "
          >
            Sign Up {loading && <Loader />}
          </button>
        </div>
      </form>

    <p className="text-body-secondary mb-4 text-base">
      By creating an account you agree with our{" "}
      <a
        href="/privacy-policy"
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="/terms-conditions"
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms & Conditions
      </a>
    </p>


      <p className="text-body-secondary text-base">
        Already have an account?
        <Link href="/" className="pl-2 text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
