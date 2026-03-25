/**
 * Mock Student Registry
 * In a real-world scenario, this would be an API call to a University ERP
 * or a verified database of official student IDs.
 */
export const studentRegistry = {
  "IIT-AD-001": {
    full_name: "Aditya Yadav",
    college: "Indian Institute of Technology",
    year: "2024",
    major: "Computer Science",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya"
  },
  "MIT-SN-002": {
    full_name: "Sneha Reddy",
    college: "MIT Institute of Design",
    year: "2025",
    major: "Interaction Design",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  "STAN-JR-003": {
    full_name: "John Roe",
    college: "Stanford University",
    year: "2023",
    major: "Software Engineering",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  }
};

export function lookupStudent(collegeId) {
  return studentRegistry[collegeId] || null;
}
