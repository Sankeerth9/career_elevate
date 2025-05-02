import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import LanguageSelector from "./LanguageSelector";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-auto text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
                <path
                  d="M4 12L12 16L20 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 16L12 20L20 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-primary">
                {t("appName")}
              </span>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`${
                  isActive("/")
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/explore-careers"
                className={`${
                  isActive("/explore-careers")
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("nav.exploreCareers")}
              </Link>
              <Link
                to="/educational-pathways"
                className={`${
                  isActive("/educational-pathways")
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("nav.educationalPathways")}
              </Link>
              <Link
                to="/job-listings"
                className={`${
                  isActive("/job-listings")
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {t("nav.jobListings")}
              </Link>
              <Link
                to="/ai-recommendations"
                className={`${
                  isActive("/ai-recommendations")
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                AI Recommendations
              </Link>
            </nav>
          </div>

          <div className="flex items-center">
            <LanguageSelector className="mr-4" />

            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-neutral-700 dark:text-neutral-300 mr-4 hidden md:block">
                  {user?.fullName || user?.username}
                </span>
                <Button variant="outline" onClick={() => logout()}>
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200 mr-4"
                >
                  {t("nav.signIn")}
                </Link>
                <Link to="/register">
                  <Button>
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`${
              isActive("/")
                ? "bg-primary-50 border-primary text-primary-700"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/explore-careers"
            className={`${
              isActive("/explore-careers")
                ? "bg-primary-50 border-primary text-primary-700"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.exploreCareers")}
          </Link>
          <Link
            to="/educational-pathways"
            className={`${
              isActive("/educational-pathways")
                ? "bg-primary-50 border-primary text-primary-700"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.educationalPathways")}
          </Link>
          <Link
            to="/job-listings"
            className={`${
              isActive("/job-listings")
                ? "bg-primary-50 border-primary text-primary-700"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("nav.jobListings")}
          </Link>
          <Link
            to="/ai-recommendations"
            className={`${
              isActive("/ai-recommendations")
                ? "bg-primary-50 border-primary text-primary-700"
                : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            AI Recommendations
          </Link>
        </div>
      </div>
    </header>
  );
}
