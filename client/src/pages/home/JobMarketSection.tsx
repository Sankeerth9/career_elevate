import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { 
  Building, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  TrendingUp 
} from "lucide-react";
import { 
  trendingCareers, 
  jobListings 
} from "@/data/jobMarketData";

export default function JobMarketSection() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">
        {t("home.jobs.title")}
      </h2>
      
      {/* Trending Career Fields */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-neutral-900">
            {t("home.jobs.trendingTitle")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            {t("home.jobs.trendingDesc")}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trendingCareers.map((career) => (
              <div key={career.id} className="bg-neutral-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{career.rank}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-neutral-900">{career.field}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {career.growthRate} Growth
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">{t("home.jobs.salary")}</p>
                    <p className="text-sm font-medium text-neutral-900">{career.averageSalary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase">{t("home.jobs.openings")}</p>
                    <p className="text-sm font-medium text-neutral-900">{career.jobOpenings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Job Listings */}
      <h3 className="text-xl font-bold text-neutral-800 mb-4">
        {t("home.jobs.recentTitle")}
      </h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-neutral-200">
          {jobListings.slice(0, 2).map((job) => (
            <li key={job.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="sm:flex sm:justify-between w-full">
                    <div>
                      <h4 className="text-lg font-medium text-primary-600 mb-1">{job.title}</h4>
                      <div className="flex items-center text-sm text-neutral-700">
                        <Building className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-500" />
                        <span>{job.company}</span>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-neutral-500">
                            <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                            {job.location}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0 sm:ml-6">
                            <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                            {job.salary}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {job.jobType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.workMode}
                        </span>
                      </div>
                      <div className="mt-4 text-right">
                        <Link to={`/job-listings/${job.id}`}>
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            View Job
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-4 py-4 bg-neutral-50 border-t border-neutral-200 sm:px-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">
              Showing 2 of {jobListings.length} jobs
            </span>
            <Link to="/job-listings" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500">
              {t("home.jobs.viewAll")}
              <ArrowRight className="ml-1 h-5 w-5 text-primary-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
