import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      {/* <span className="bg-purple-200 text-purple-700 text-xs font-semibold px-3 py-1 my-2 rounded-full">
        COOKIE POLICY
      </span>{" "} */}
      <p><strong>Effective Date:</strong> </p>
      <p><strong>Last Updated:</strong> </p>
      
      <h2 className="text-xl font-semibold mt-4">Introduction</h2>
      <p>At AssuredJob.com , we use cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and personalize content. This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences.</p>
      <p>By continuing to use our website, you consent to our use of cookies in accordance with this policy.</p>
      
      <h2 className="text-xl font-semibold mt-4">What Are Cookies?</h2>
      <p>Cookies are small text files that websites place on your device to store information. These help us understand how users interact with our site, enhance user experience, and support our advertising efforts.</p>
      
      <h2 className="text-xl font-semibold mt-4">Types of Cookies We Use</h2>
      <h3 className="text-lg font-medium mt-3">1. Essential Cookies (Strictly Necessary)</h3>
      <ul className="list-disc ml-6">
        <li>These cookies are required for the basic functionality of our website.</li>
        <li>They enable security, accessibility, and navigation.</li>
        <li>Without these, the site may not function properly.</li>
      </ul>
      
      <h3 className="text-lg font-medium mt-3">2. Performance & Analytics Cookies</h3>
      <ul className="list-disc ml-6">
        <li>These cookies help us measure website traffic, analyze user behavior, and improve our services.</li>
        <li>Example: Google Analytics.</li>
      </ul>
      
      <h3 className="text-lg font-medium mt-3">3. Functional Cookies</h3>
      <ul className="list-disc ml-6">
        <li>These cookies remember your preferences and settings, such as language selection and login details.</li>
      </ul>
      
      <h3 className="text-lg font-medium mt-3">4. Advertising & Marketing Cookies</h3>
      <ul className="list-disc ml-6">
        <li>These cookies track your browsing behavior to display relevant job opportunities and advertisements.</li>
        <li>We may share this data with third-party advertisers.</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-4">Third-Party Cookies</h2>
      <p>Some third-party services we use (such as Google, LinkedIn, and Facebook) may place cookies on your device when you interact with our site.</p>
      
      <h2 className="text-xl font-semibold mt-4">How to Manage Cookies</h2>
      <p>You can manage or disable cookies through your browser settings. Note that restricting cookies may impact your experience on AssuredJob.com.</p>
      <p><strong>Steps to Disable Cookies in Browsers:</strong></p>
      <ul className="list-disc ml-6">
        <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies.</li>
        <li><strong>Firefox:</strong> Preferences &gt; Privacy & Security &gt; Cookies and Site Data.</li>
        <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</li>
        <li><strong>Edge:</strong> Settings &gt; Cookies and Site Permissions.</li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-4">Changes to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.</p>
    </div>
  );
}

export default PrivacyPolicy;