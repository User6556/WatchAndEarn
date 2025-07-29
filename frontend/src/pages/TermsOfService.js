import React from 'react';
import Layout from '../components/Layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Watch & Earn platform, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Watch & Earn is a platform that allows users to watch advertisements and earn rewards. 
                Users can accumulate earnings and request withdrawals subject to our terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use our service, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Be at least 18 years old or have parental consent</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not create multiple accounts for the same person</li>
                <li>Not use automated tools or bots</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Earning and Rewards</h2>
              <p className="text-gray-700 mb-4">
                Users can earn rewards by watching advertisements. The following rules apply:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Rewards are earned per completed ad view</li>
                <li>Minimum withdrawal amount is $50</li>
                <li>New accounts must wait 30 days before first withdrawal</li>
                <li>We reserve the right to adjust reward rates</li>
                <li>Fraudulent activity will result in account suspension</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                Users are prohibited from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Using automated tools, bots, or scripts</li>
                <li>Creating multiple accounts</li>
                <li>Attempting to manipulate the reward system</li>
                <li>Sharing account credentials</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Uploading malicious content or viruses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment and Withdrawals</h2>
              <p className="text-gray-700 mb-4">
                Withdrawal requests are processed according to the following terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Minimum withdrawal amount: $50</li>
                <li>Processing time: 1-5 business days</li>
                <li>Available payment methods: PayPal, Bank Transfer, Crypto</li>
                <li>We may require identity verification for large withdrawals</li>
                <li>Fees may apply depending on payment method</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend your account at any time for violations 
                of these terms. Upon termination, any remaining balance may be forfeited if earned 
                through fraudulent means.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Watch & Earn shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of 
                significant changes via email or through the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@watchandearn.com<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService; 