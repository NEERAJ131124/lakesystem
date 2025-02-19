import React from "react";
import l0 from "../assets/wlake.jpg";

const Terms = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="relative overflow-hidden" style={{ minHeight: "500px" }}>
                <img
                    src={l0}
                    alt="Terms and Conditions"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black opacity-50" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Terms & Conditions
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Read our terms and conditions carefully before using our services.
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms Content Section */}
            {/* <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                    <p className="text-gray-700 leading-6">
                        Welcome to our terms and conditions. By using our website, you agree to the following terms.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Usage Policy</h2>
                    <p className="text-gray-700 leading-6">
                        Users must comply with all applicable laws and respect the rights of others while using our services.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Changes to Terms</h2>
                    <p className="text-gray-700 leading-6">
                        We reserve the right to update or modify these terms at any time without prior notice.
                    </p>
                </div>
            </div> */}
        </div>
    );
};

export default Terms;