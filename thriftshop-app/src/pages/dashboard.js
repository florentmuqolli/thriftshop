import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please log in to access your shopping dashboard and track your orders.</p>
              <Link 
                href="/login" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
              <p className="text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Shopping Dashboard</h1>
              <p className="text-purple-200">Track your orders and shopping activity</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center">
              <Link 
                href="/settings" 
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">Active Orders</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">9</p>
                  <p className="text-sm text-gray-600">Delivered</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">$327</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Active Orders</h2>
                <Link href="/orders" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View all orders
                </Link>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                    <div>
                      <p className="font-medium">Vintage Denim Jacket</p>
                      <p className="text-sm text-gray-500">Order #TS1254</p>
                      <p className="text-purple-600 font-semibold">$45.99</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                      Shipped
                    </div>
                    <p className="text-sm text-gray-500">Estimated delivery: Tomorrow</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mr-4"></div>
                    <div>
                      <p className="font-medium">Leather Crossbody Bag</p>
                      <p className="text-sm text-gray-500">Order #TS1302</p>
                      <p className="text-purple-600 font-semibold">$62.50</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                      Processing
                    </div>
                    <p className="text-sm text-gray-500">Estimated delivery: Sep 15-17</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Delivery Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Primary Address</p>
                <p className="text-gray-600">123 Main Street, Apt 4B</p>
                <p className="text-gray-600">New York, NY 10001</p>
                <p className="text-gray-600">United States</p>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2">
                  Edit Address
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Track Package</h2>
              <div className="mb-4">
                <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tracking-number"
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter tracking number"
                  />
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition duration-300">
                    Track
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">Enter your tracking number to check the status of your delivery.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
              <div className="space-y-4">
                <Link href="/products" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-300">
                  <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="font-medium">Continue Shopping</span>
                </Link>
                <Link href="/orders" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-300">
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="font-medium">Order History</span>
                </Link>
                <Link href="/returns" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-300">
                  <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="font-medium">Start a Return</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Need Help with Delivery?</h2>
              <p className="text-gray-600 mb-4">Our support team is here to help with any delivery issues.</p>
              <div className="space-y-3">
                <Link href="/help/delivery" className="flex items-center text-purple-600 hover:text-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Delivery FAQs
                </Link>
                <Link href="/contact" className="flex items-center text-purple-600 hover:text-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}