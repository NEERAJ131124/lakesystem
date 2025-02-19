import React from "react";
import l0 from "../assets/wlake.jpg";

const Privacy = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>
                <img
                    src={l0}
                    alt="Privacy Policy"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black opacity-50" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Privacy Policy
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Your privacy is important to us. Read our policy below to learn more.
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy Content */}
            {/* <div className="max-w-4xl mx-auto py-16 px-6 text-gray-700">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-6">We collect personal information that you provide to us directly, such as when you register an account, contact us, or interact with our services.</p>

                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-6">We use your information to provide, maintain, and improve our services, communicate with you, and ensure compliance with our policies.</p>

                <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
                <p className="mb-6">We do not sell your personal information. We may share your data with trusted third parties to help operate our services.</p>

                <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
                <p className="mb-6">You have the right to access, update, or delete your personal information. Contact us for assistance regarding your data.</p>

                <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                <p className="mb-6">We may update our Privacy Policy from time to time. Please check this page periodically for any changes.</p>
            </div> */}
        </div>
    );
};

export default Privacy;
