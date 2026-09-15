import { mockEquipment } from "./equipment";
export const equipmentPreview = mockEquipment.slice(0, 4);

export const featuredProjects = [
  {
    id: "proj-1",
    title: "Low-Cost Prosthetic Hand",
    type: "Student Thesis",
    team: "Dept. of Mechanical Engineering",
    year: "2025",
    technologies: ["3D Printing", "Electronics", "Sensors"],
    outcome: "Functional prototype under $100.",
    image: "/images/prosthetic.webp"
  },
  {
    id: "proj-2",
    title: "Bamboo Composite Drone",
    type: "Sponsored Research",
    team: "Aero Fab Team",
    year: "2024",
    technologies: ["CNC Router", "Composites", "Laser Cutting"],
    outcome: "Reduced chassis weight by 30%.",
    image: "/images/drone.webp"
  },
  {
    id: "proj-3",
    title: "Smart Irrigation IoT Node",
    type: "Startup Prototype",
    team: "AgriTech Innovators",
    year: "2025",
    technologies: ["PCB Milling", "Soldering", "3D Printing"],
    outcome: "Deployed in 5 pilot farms.",
    image: "/images/iotnode.webp"
  }
];

export const impactMetrics = [
  { label: "Active Members", value: "850+" },
  { label: "Machines & Facilities", value: "45" },
  { label: "Projects Completed", value: "1,200" },
  { label: "Annual Machine Hours", value: "15,000" }
];
