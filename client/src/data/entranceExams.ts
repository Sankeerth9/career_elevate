// Entrance exam data

export interface EntranceExam {
  id: number;
  name: string;
  fullName: string;
  forCareer: string[];
  eligibility: string;
  examMonth: string;
  applicationMonth: string;
  officialWebsite: string;
  examLevel: "national" | "state" | "university" | "international";
  importance: number; // 1-5 scale, 5 being most important
}

// Sample entrance exams
export const entranceExams: EntranceExam[] = [
  {
    id: 1,
    name: "JEE Main",
    fullName: "Joint Entrance Examination (Main)",
    forCareer: ["Engineering", "Architecture"],
    eligibility: "12th pass with PCM",
    examMonth: "January, April, May, June",
    applicationMonth: "December, February, March, May",
    officialWebsite: "https://jeemain.nta.nic.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 2,
    name: "JEE Advanced",
    fullName: "Joint Entrance Examination (Advanced)",
    forCareer: ["Engineering at IITs"],
    eligibility: "Top 2.5 lakh rank holders in JEE Main",
    examMonth: "June",
    applicationMonth: "May",
    officialWebsite: "https://jeeadv.ac.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 3,
    name: "NEET-UG",
    fullName: "National Eligibility cum Entrance Test (Undergraduate)",
    forCareer: ["Medical (MBBS)", "Dental (BDS)", "AYUSH"],
    eligibility: "12th pass with PCB",
    examMonth: "May",
    applicationMonth: "March-April",
    officialWebsite: "https://neet.nta.nic.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 4,
    name: "CLAT",
    fullName: "Common Law Admission Test",
    forCareer: ["Law"],
    eligibility: "12th pass with minimum 45% marks",
    examMonth: "December",
    applicationMonth: "September-October",
    officialWebsite: "https://consortiumofnlus.ac.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 5,
    name: "CAT",
    fullName: "Common Admission Test",
    forCareer: ["MBA", "Management"],
    eligibility: "Bachelor's degree with minimum 50% marks",
    examMonth: "November",
    applicationMonth: "August-September",
    officialWebsite: "https://iimcat.ac.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 6,
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    forCareer: ["M.Tech", "ME", "PhD"],
    eligibility: "B.E./B.Tech or pursuing final year",
    examMonth: "February",
    applicationMonth: "September-October",
    officialWebsite: "https://gate.iitb.ac.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 7,
    name: "UPSC CSE",
    fullName: "UPSC Civil Services Examination",
    forCareer: ["Civil Services (IAS, IPS, IFS, etc.)"],
    eligibility: "Bachelor's degree in any discipline",
    examMonth: "June (Prelims), September (Mains)",
    applicationMonth: "March-April",
    officialWebsite: "https://upsc.gov.in/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 8,
    name: "EAMCET",
    fullName: "Engineering, Agriculture and Medical Common Entrance Test",
    forCareer: ["Engineering", "Agriculture", "Pharmacy"],
    eligibility: "12th pass with relevant subjects",
    examMonth: "May",
    applicationMonth: "March-April",
    officialWebsite: "https://eamcet.tsche.ac.in/",
    examLevel: "state",
    importance: 4
  },
  {
    id: 9,
    name: "CA Foundation",
    fullName: "Chartered Accountancy Foundation",
    forCareer: ["Chartered Accountancy"],
    eligibility: "12th pass",
    examMonth: "June, December",
    applicationMonth: "March-April, September-October",
    officialWebsite: "https://www.icai.org/",
    examLevel: "national",
    importance: 5
  },
  {
    id: 10,
    name: "CSEET",
    fullName: "Company Secretary Executive Entrance Test",
    forCareer: ["Company Secretary"],
    eligibility: "12th pass",
    examMonth: "January, March, May, July, September, November",
    applicationMonth: "Monthly registrations",
    officialWebsite: "https://www.icsi.edu/",
    examLevel: "national",
    importance: 4
  }
];

// Get entrance exams by career field
export function getExamsByCareer(career: string): EntranceExam[] {
  return entranceExams.filter(exam => 
    exam.forCareer.some(careerField => 
      careerField.toLowerCase().includes(career.toLowerCase())
    )
  );
}

// Get important exams
export function getImportantExams(importance: number = 5): EntranceExam[] {
  return entranceExams.filter(exam => exam.importance >= importance);
}

// Get exams by level
export function getExamsByLevel(level: "national" | "state" | "university" | "international"): EntranceExam[] {
  return entranceExams.filter(exam => exam.examLevel === level);
}
