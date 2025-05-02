// Simple fee calculator service

type EducationLevel = '10th' | '12th' | 'graduation' | 'post_graduation';
type CareerPath = 'engineering' | 'medical' | 'law' | 'commerce' | 'civilservice' | 'esports' | 'arts';
type CollegeType = 'government' | 'private' | 'abroad';

interface FeeStructure {
  tuition: number; // in lakhs (INR)
  accommodation: number; // in lakhs (INR)
  other: number; // in lakhs (INR)
  total: number; // in lakhs (INR)
  emiOptions: {
    monthly: number; // monthly EMI in thousands (INR)
    duration: number; // in months
  };
  scholarshipOptions: string[];
}

export function calculateFees(
  educationLevel: EducationLevel,
  careerPath: CareerPath,
  collegeType: CollegeType
): FeeStructure {
  let tuition = 0;
  let accommodation = 0;
  let other = 0;
  
  // Calculate tuition fees based on career path and college type
  switch (careerPath) {
    case 'engineering':
      if (collegeType === 'government') tuition = 0.8;
      else if (collegeType === 'private') tuition = 8;
      else if (collegeType === 'abroad') tuition = 40;
      break;
    case 'medical':
      if (collegeType === 'government') tuition = 1.2;
      else if (collegeType === 'private') tuition = 50;
      else if (collegeType === 'abroad') tuition = 80;
      break;
    case 'law':
      if (collegeType === 'government') tuition = 0.5;
      else if (collegeType === 'private') tuition = 7;
      else if (collegeType === 'abroad') tuition = 35;
      break;
    case 'commerce':
      if (collegeType === 'government') tuition = 0.3;
      else if (collegeType === 'private') tuition = 3;
      else if (collegeType === 'abroad') tuition = 25;
      break;
    case 'civilservice':
      // Coaching fees
      if (collegeType === 'government') tuition = 1;
      else if (collegeType === 'private') tuition = 2.5;
      else if (collegeType === 'abroad') tuition = 5;
      break;
    case 'esports':
      if (collegeType === 'government') tuition = 0.5;
      else if (collegeType === 'private') tuition = 5;
      else if (collegeType === 'abroad') tuition = 20;
      break;
    case 'arts':
      if (collegeType === 'government') tuition = 0.3;
      else if (collegeType === 'private') tuition = 4;
      else if (collegeType === 'abroad') tuition = 30;
      break;
  }
  
  // Calculate accommodation fees based on college type
  if (collegeType === 'government') accommodation = 0.6;
  else if (collegeType === 'private') accommodation = 1.2;
  else if (collegeType === 'abroad') accommodation = 8;
  
  // Calculate other fees (books, materials, etc.)
  if (collegeType === 'government') other = 0.3;
  else if (collegeType === 'private') other = 0.8;
  else if (collegeType === 'abroad') other = 5;
  
  // Total fees
  const total = tuition + accommodation + other;
  
  // EMI calculation (simple)
  const emiOptions = {
    monthly: Math.round((total * 100000) / 36) / 1000, // 3-year EMI in thousands
    duration: 36 // 3 years
  };
  
  // Scholarship options
  let scholarshipOptions: string[] = [];
  
  if (collegeType === 'government') {
    scholarshipOptions = [
      'Merit-based government scholarship (up to 100%)',
      'SC/ST scholarship',
      'Minority scholarship'
    ];
  } else if (collegeType === 'private') {
    scholarshipOptions = [
      'Merit scholarship (up to 50%)',
      'Sports quota (10-25%)',
      'Financial need-based scholarship'
    ];
  } else if (collegeType === 'abroad') {
    scholarshipOptions = [
      'International student scholarship (10-50%)',
      'Country-specific grants',
      'Research assistantships'
    ];
  }
  
  return {
    tuition,
    accommodation,
    other,
    total,
    emiOptions,
    scholarshipOptions
  };
}
