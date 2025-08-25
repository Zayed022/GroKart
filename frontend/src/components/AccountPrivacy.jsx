import React from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AccountPrivacy = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
          Account privacy and policy
        </h1>

        <p className="text-gray-700 mb-4 leading-relaxed">
          We i.e. <strong>"Grokart Commerce Private Limited"</strong>, are
          committed to protecting the privacy and security of your personal
          information. Your privacy is important to us and maintaining your
          trust is paramount.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          This privacy policy explains how we collect, use, process and disclose
          information about you. By using our website/ app/ platform and
          affiliated services, you consent to the terms of our privacy policy
          (“Privacy Policy”) in addition to our ‘Terms of Use.’ We encourage you
          to read this privacy policy to understand the collection, use, and
          disclosure of your information from time to time, to keep yourself
          updated with the changes and updates that we make to this policy. This
          privacy policy describes our privacy practices for all websites,
          products and services that are linked to it. However this policy does
          not apply to those affiliates and partners that have their own privacy
          policy. In such situations, we recommend that you read the privacy
          policy on the applicable site. Should you have any clarifications
          regarding this privacy policy, please write to us at{" "}
          <a
            href="mailto:grokart.co@gmail.com"
            className="text-blue-600 underline"
          >
            grokart.co@gmail.com
          </a>
          .
        </p>

        {/* Request to Delete Account Box */}
        
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            onClick={() => {
              window.location.href = "/delete-account";
            }}
          >
            Delete account
          </button>
        
      </div>
    </>
  );
};

export default AccountPrivacy;
