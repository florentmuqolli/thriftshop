import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-12 text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-purple-200">Last updated: September 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="#introduction" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                1. Introduction
              </Link>
              <Link href="#accounts" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                2. User Accounts
              </Link>
              <Link href="#products" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                3. Products & Listings
              </Link>
              <Link href="#transactions" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                4. Transactions
              </Link>
              <Link href="#returns" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                5. Returns & Refunds
              </Link>
              <Link href="#conduct" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                6. User Conduct
              </Link>
              <Link href="#intellectual" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                7. Intellectual Property
              </Link>
              <Link href="#liability" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                8. Liability
              </Link>
              <Link href="#changes" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                9. Changes to Terms
              </Link>
              <Link href="#contact" className="text-purple-600 hover:text-purple-700 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                10. Contact Us
              </Link>
            </div>
          </div>

          <div className="p-8">
            <section id="introduction" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to ThriftShop! These Terms and Conditions govern your use of our website and services. 
                By accessing or using ThriftShop, you agree to be bound by these Terms and our Privacy Policy.
              </p>
              <p className="text-gray-600">
                ThriftShop is an online marketplace that connects buyers and sellers of second-hand clothing, 
                accessories, and related items. We provide a platform for transactions but are not directly 
                involved in the actual sale between buyers and sellers.
              </p>
            </section>

            <section id="accounts" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features of ThriftShop, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Providing accurate and complete information during registration</li>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Promptly updating your information if it changes</li>
              </ul>
              <p className="text-gray-600">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in 
                fraudulent or inappropriate activities.
              </p>
            </section>

            <section id="products" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Products & Listings</h2>
              <p className="text-gray-600 mb-4">
                Sellers on ThriftShop are responsible for the accuracy and quality of their listings. All items must:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Be accurately described with clear, honest information</li>
                <li>Include photographs that accurately represent the item's condition</li>
                <li>Be priced fairly and appropriately</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Prohibited items include but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Counterfeit or replica items</li>
                <li>Items that promote hate speech or illegal activities</li>
                <li>Hazardous materials or recalled items</li>
                <li>Items that infringe on intellectual property rights</li>
              </ul>
            </section>

            <section id="transactions" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Transactions</h2>
              <p className="text-gray-600 mb-4">
                ThriftShop facilitates transactions between buyers and sellers but is not a party to the sales contract.
                We provide payment processing services but are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>The quality, safety, or legality of items sold</li>
                <li>The accuracy of listings or sellers' descriptions</li>
                <li>The ability of sellers to sell items or buyers to pay for them</li>
              </ul>
              <p className="text-gray-600">
                Buyers are responsible for reading item descriptions carefully and asking questions before purchasing. 
                Sellers are responsible for shipping items promptly and as described.
              </p>
            </section>

            <section id="returns" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Returns & Refunds</h2>
              <p className="text-gray-600 mb-4">
                Our return policy is designed to be fair to both buyers and sellers:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Buyers may request returns within 7 days of receipt if the item is not as described</li>
                <li>Sellers must clearly state their return policy in each listing</li>
                <li>Return shipping costs are typically the responsibility of the buyer unless the item was misrepresented</li>
                <li>Refunds will be processed once the returned item is received and verified</li>
              </ul>
              <p className="text-gray-600">
                ThriftShop may mediate disputes between buyers and sellers but makes no guarantees about the outcome.
              </p>
            </section>

            <section id="conduct" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. User Conduct</h2>
              <p className="text-gray-600 mb-4">
                When using ThriftShop, you agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Post false, inaccurate, or misleading content</li>
                <li>Distribute viruses or malicious code</li>
                <li>Spam other users or engage in harassing behavior</li>
                <li>Circumvent or manipulate our fee structure</li>
                <li>Interfere with the proper functioning of ThriftShop</li>
              </ul>
              <p className="text-gray-600">
                We reserve the right to remove content and suspend accounts that violate these guidelines.
              </p>
            </section>

            <section id="intellectual" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                ThriftShop and its original content, features, and functionality are owned by ThriftShop and are 
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-600">
                You may not use our trademarks, logos, or other proprietary information without our express written consent. 
                By listing items on ThriftShop, sellers grant us a license to use, display, and distribute their content 
                in connection with our services.
              </p>
            </section>

            <section id="liability" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Liability</h2>
              <p className="text-gray-600 mb-4">
                ThriftShop is not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Any direct, indirect, incidental, or consequential damages resulting from your use of our services</li>
                <li>The actions or omissions of buyers or sellers on our platform</li>
                <li>Errors or interruptions in service</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
              </ul>
              <p className="text-gray-600">
                Our total liability to you for all claims arising from these Terms or your use of our services 
                shall not exceed the amount of fees you paid to us in the six months preceding the claim.
              </p>
            </section>

            <section id="changes" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We may update these Terms from time to time to reflect changes in our practices or for other operational, 
                legal, or regulatory reasons. We will notify you of any material changes by posting the new Terms on our 
                site and updating the "Last updated" date.
              </p>
              <p className="text-gray-600">
                Your continued use of ThriftShop after any changes constitutes your acceptance of the new Terms. 
                If you do not agree to the changes, you should discontinue using our services.
              </p>
            </section>

            <section id="contact" className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>Email: legal@thriftshop.com</li>
                <li>Address: 123 Sustainability Street, Eco City, EC 12345</li>
                <li>Phone: +1 (555) 123-THRIFT</li>
              </ul>
            </section>

            <div className="bg-purple-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Acceptance of Terms</h3>
              <p className="text-purple-700">
                By using ThriftShop, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}