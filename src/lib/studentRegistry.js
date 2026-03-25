/**
 * Mock Student Registry
 * In a real-world scenario, this would be an API call to a University ERP
 * or a verified database of official student IDs.
 */
export const studentRegistry = {
  "IIT-AD-001": {
    full_name: "Aditya Yadav",
    college: "IIT Delhi",
    year: "2024",
    major: "Computer Science",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya"
  },
  "BITS-SN-002": {
    full_name: "Sneha Reddy",
    college: "BITS Pilani",
    year: "2025",
    major: "Electrical Engineering",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  "DTU-RJ-003": {
    full_name: "Rohan Joshi",
    college: "Delhi Technological University",
    year: "2024",
    major: "Software Engineering",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan"
  },
  "NSUT-AK-004": {
    full_name: "Ananya Kapoor",
    college: "NSUT Delhi",
    year: "2026",
    major: "Information Technology",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya"
  },
  "IIIT-MS-005": {
    full_name: "Meera Sharma",
    college: "IIIT Hyderabad",
    year: "2024",
    major: "Computer Science",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera"
  }
};

export function lookupStudent(collegeId) {
  return studentRegistry[collegeId] || null;
}
