import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ThriftShop
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link
              href="/products"
              className="hover:text-purple-600 transition duration-300"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="hover:text-purple-600 transition duration-300"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-purple-600 transition duration-300"
            >
              Contact
            </Link>
            <Link
              href="/sell"
              className="hover:text-purple-600 transition duration-300"
            >
              Sell
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-purple-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {session.user?.name?.charAt(0).toUpperCase() ||
                      session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm">
                    {session.user?.name || session.user?.email}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 animate-in fade-in-80 slide-in-from-top-2">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    >
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/AdminDashboard"
                        className="block px-4 py-2 text-sm text-purple-600 font-semibold hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 transition duration-300 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-purple-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-3 px-2">
              <Link
                href="/products"
                className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium"
              >
                Contact
              </Link>
              <Link
                href="/sell"
                className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium"
              >
                Sell
              </Link>

              <div className="border-t border-gray-200 pt-3 mt-3">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium block"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium block"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium block"
                    >
                      Wishlist
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/AdminDashboard"
                        className="text-purple-600 font-semibold hover:text-purple-700 transition duration-300 py-2 font-medium block"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-red-600 hover:text-red-700 transition duration-300 py-2 font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-purple-600 transition duration-300 py-2 font-medium block"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-purple-600 hover:text-purple-700 transition duration-300 py-2 font-medium block"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
