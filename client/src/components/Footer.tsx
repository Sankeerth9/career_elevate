import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <svg
                className="h-8 w-auto text-white"
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
              <span className="ml-2 text-xl font-bold text-white">
                {t("appName")}
              </span>
            </div>
            <p className="mt-4 text-base text-neutral-300">
              {t("footer.description")}
            </p>
            <div className="mt-4 flex space-x-6">
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-300"
                aria-label="Facebook"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-300"
                aria-label="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-neutral-300"
                aria-label="Twitter"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
              {t("footer.explore")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/explore-careers"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.careerPaths")}
                </Link>
              </li>
              <li>
                <Link
                  to="/educational-pathways"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.educationalOptions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/educational-pathways"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.entranceExams")}
                </Link>
              </li>
              <li>
                <Link
                  to="/job-listings"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("nav.jobListings")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 tracking-wider uppercase">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-neutral-300 hover:text-white"
                >
                  {t("footer.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-700">
          <p className="text-base text-neutral-400 text-center">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
