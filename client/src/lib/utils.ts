import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format currency (INR)
export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string') {
    // Return as is if already formatted
    if (amount.includes('₹')) return amount;
    amount = parseFloat(amount);
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Function to calculate EMI
export function calculateEMI(principal: number, rate: number, time: number): number {
  // Rate is the interest rate per month (rate/12/100)
  // Time is the number of months
  const r = rate / 12 / 100;
  return principal * r * Math.pow(1 + r, time) / (Math.pow(1 + r, time) - 1);
}

// Format date to readable string
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Get a friendly time ago string
export function timeAgo(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return 'just now';
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
  }
  
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
}

// Truncate text to a specified length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get badge color based on growth rate or demand
export function getBadgeColor(value: string): string {
  if (value.includes('+') || 
      value.toLowerCase().includes('high') || 
      value.toLowerCase().includes('good')) {
    return 'green';
  }
  
  if (value.includes('-') || value.toLowerCase().includes('low')) {
    return 'red';
  }
  
  return 'blue';
}

// Calculate match percentage based on user's profile and career path requirements
export function calculateMatchPercentage(
  userProfile: { skills: string[], interests: string[], educationLevel: string },
  careerRequirements: { skills: string[], interests: string[], education: string[] }
): number {
  let matchPoints = 0;
  let totalPoints = 0;
  
  // Match skills
  if (userProfile.skills && careerRequirements.skills) {
    totalPoints += careerRequirements.skills.length;
    for (const skill of careerRequirements.skills) {
      if (userProfile.skills.includes(skill)) {
        matchPoints += 1;
      }
    }
  }
  
  // Match interests
  if (userProfile.interests && careerRequirements.interests) {
    totalPoints += careerRequirements.interests.length;
    for (const interest of careerRequirements.interests) {
      if (userProfile.interests.includes(interest)) {
        matchPoints += 1;
      }
    }
  }
  
  // Match education level
  if (userProfile.educationLevel && careerRequirements.education) {
    totalPoints += 1;
    if (careerRequirements.education.includes(userProfile.educationLevel)) {
      matchPoints += 1;
    }
  }
  
  // Calculate percentage
  if (totalPoints === 0) return 0;
  return Math.round((matchPoints / totalPoints) * 100);
}
