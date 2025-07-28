//src\components\Home\Newsletter\index.tsx
"use client";

import { useState } from 'react';
import Image from "next/image";
import toast from 'react-hot-toast';
import { subscribeToNewsletterAction } from '@/app/admin/actions';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await subscribeToNewsletterAction(email);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(result.success!);
            setEmail('');
        }
        setLoading(false);
    };

    return (
        <section className="bg-blue-600">
            <div className="container mx-auto max-w-6xl px-4 py-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    
                    {/* Text on the left */}
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl font-semibold text-white">Stay Updated</h3>
                        <p className="text-base text-white/75">Subscribe to our newsletter for the latest news.</p>
                    </div>

                    {/* Form on the right */}
                    <div className="w-full max-w-md">
                        <form 
                            onSubmit={handleSubmit}
                            className="relative"
                        >
                            <input 
                                type="email" 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-3 text-base w-full text-black rounded-full pl-6 pr-20 focus:outline-none focus:ring-2 focus:ring-white" 
                                placeholder="Enter your email address" 
                                autoComplete="off"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="p-2 focus:outline-none bg-primary hover:bg-secondary duration-150 ease-in-out rounded-full disabled:bg-gray-400"
                                    aria-label="Subscribe"
                                >
                                    <Image src="/images/newsletter/send.svg" alt="send-icon" width={20} height={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Newsletter;
