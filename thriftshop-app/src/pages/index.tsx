import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to ThriftShop</h1>
          <p className="text-xl mb-8 max-w-2xl">Discover unique second-hand treasures and reduce fashion waste.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products" 
              className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition duration-300"
            >
              Shop Now
            </Link>
            <Link 
              href="/dashboard" 
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-purple-600 transition duration-300"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Shopping</h3>
              <p className="text-gray-600">Reduce fashion waste by buying and selling pre-loved items.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Great Value</h3>
              <p className="text-gray-600">Find high-quality items at a fraction of the original price.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
              <p className="text-gray-600">Every item is carefully inspected to ensure quality standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-lg">
              <div className="h-64 bg-gray-200 transition duration-500 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">Women</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <div className="h-64 bg-gray-300 transition duration-500 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">Men</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <div className="h-64 bg-gray-400 transition duration-500 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">Kids</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <div className="h-64 bg-gray-500 transition duration-500 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold">Accessories</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to refresh your wardrobe?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of happy customers who've found their perfect style at ThriftShop.</p>
          <Link 
            href="/products" 
            className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition duration-300 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}