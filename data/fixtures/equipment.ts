export type EquipmentStatus = 'available' | 'in-use' | 'reserved' | 'training' | 'maintenance' | 'unavailable';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  assetId: string;
  facility: string;
  room: string;
  shortDescription: string;
  processCapability: string;
  workingArea: string;
  supportedMaterials: string[];
  status: EquipmentStatus;
  trainingRequired: string;
  internalRate: number;
  externalRate: number;
  image: string;
  nextAvailable: string;
}

export const mockEquipment: Equipment[] = [
  {
    id: "eq-fdm-1",
    name: "Stratasys F370",
    category: "FDM 3D Printer",
    manufacturer: "Stratasys",
    model: "F370",
    assetId: "BUET-FAB-001",
    facility: "Additive Manufacturing Lab",
    room: "Room 101",
    shortDescription: "Industrial FDM printer capable of printing high-strength engineering thermoplastics with soluble support.",
    processCapability: "Fused Deposition Modeling",
    workingArea: "355 x 254 x 355 mm",
    supportedMaterials: ["ABS-M30", "PLA", "ASA", "TPU 92A", "PC-ABS", "Diran 410MF07"],
    status: "available",
    trainingRequired: "Basic Safety & FDM Operation",
    internalRate: 150,
    externalRate: 500,
    image: "https://picsum.photos/seed/fdm3/800/600",
    nextAvailable: "Now"
  },
  {
    id: "eq-laser-1",
    name: "Epilog Fusion Pro 48",
    category: "Laser Cutter",
    manufacturer: "Epilog",
    model: "Fusion Pro 48 Dual Source",
    assetId: "BUET-FAB-042",
    facility: "Digital Subtractive Lab",
    room: "Room 102",
    shortDescription: "Large format laser cutter and engraver with both CO2 (120W) and Fiber (50W) sources for processing organics and metals.",
    processCapability: "Laser Cutting & Engraving",
    workingArea: "1219 x 914 mm",
    supportedMaterials: ["Wood", "Acrylic", "Cardboard", "Leather", "Anodized Aluminum", "Bare Metals (Marking)"],
    status: "in-use",
    trainingRequired: "Laser Safety Level 1",
    internalRate: 200,
    externalRate: 800,
    image: "https://picsum.photos/seed/laser1/800/600",
    nextAvailable: "Today, 14:00"
  },
  {
    id: "eq-cnc-1",
    name: "Haas VF-2",
    category: "CNC Milling Machine",
    manufacturer: "Haas Automation",
    model: "VF-2",
    assetId: "BUET-FAB-055",
    facility: "Advanced Machining Center",
    room: "Room 105",
    shortDescription: "Robust vertical machining center for precision milling of metals and engineering plastics.",
    processCapability: "3-Axis CNC Milling",
    workingArea: "762 x 406 x 508 mm",
    supportedMaterials: ["Aluminum", "Steel", "Brass", "Titanium", "Delrin", "Polycarbonate"],
    status: "training",
    trainingRequired: "CNC Machining Level 2 Certification",
    internalRate: 500,
    externalRate: 2000,
    image: "https://picsum.photos/seed/cnc2/800/600",
    nextAvailable: "Requires Certification"
  },
  {
    id: "eq-sla-1",
    name: "Formlabs Form 3+",
    category: "SLA Resin Printer",
    manufacturer: "Formlabs",
    model: "Form 3+",
    assetId: "BUET-FAB-012",
    facility: "Additive Manufacturing Lab",
    room: "Room 101",
    shortDescription: "High-resolution desktop SLA printer for detailed models, functional prototypes, and casting patterns.",
    processCapability: "Stereolithography (SLA)",
    workingArea: "145 × 145 × 185 mm",
    supportedMaterials: ["Standard Resin", "Tough Resin", "Flexible Resin", "Castable Wax", "High Temp Resin"],
    status: "maintenance",
    trainingRequired: "Resin Handling & Post-Processing",
    internalRate: 100,
    externalRate: 350,
    image: "https://picsum.photos/seed/sla1/800/600",
    nextAvailable: "Est. 24 Oct"
  },
  {
    id: "eq-robot-1",
    name: "Universal Robots UR10e",
    category: "Robotics Equipment",
    manufacturer: "Universal Robots",
    model: "UR10e",
    assetId: "BUET-FAB-102",
    facility: "Automation & Robotics Lab",
    room: "Room 201",
    shortDescription: "Collaborative robot arm (cobot) with 12.5 kg payload and 1300 mm reach, suitable for automated machine tending and assembly research.",
    processCapability: "6-Axis Robotic Manipulation",
    workingArea: "1300 mm spherical radius",
    supportedMaterials: ["N/A - Payload dependent"],
    status: "available",
    trainingRequired: "Cobot Safety & Programming",
    internalRate: 250,
    externalRate: 1000,
    image: "https://picsum.photos/seed/robot1/800/600",
    nextAvailable: "Tomorrow, 09:00"
  },
  {
    id: "eq-pcb-1",
    name: "Voltera V-One",
    category: "PCB Fabrication Equipment",
    manufacturer: "Voltera",
    model: "V-One",
    assetId: "BUET-FAB-088",
    facility: "Electronics Lab",
    room: "Room 204",
    shortDescription: "Desktop PCB printer for rapid prototyping of double-sided boards, dispensing solder paste, and reflow.",
    processCapability: "Conductive Ink Printing & Solder Reflow",
    workingArea: "128 x 116 mm",
    supportedMaterials: ["FR4", "Kapton", "Conductive Ink", "Solder Paste"],
    status: "available",
    trainingRequired: "Basic Electronics Safety",
    internalRate: 50,
    externalRate: 200,
    image: "https://picsum.photos/seed/pcb1/800/600",
    nextAvailable: "Now"
  }
];

export const equipmentCategories = Array.from(new Set(mockEquipment.map(e => e.category)));
export const facilities = Array.from(new Set(mockEquipment.map(e => e.facility)));
