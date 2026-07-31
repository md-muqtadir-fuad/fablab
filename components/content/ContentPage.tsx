import { PageTemplate, type PageTemplateProps } from "./PageTemplate";

const pages: Record<string, PageTemplateProps> = {
  explore: { title: "Explore what you can make", intro: "Discover the machines, spaces, and expertise available to turn an idea into a tested prototype.", primary: { label: "Browse equipment", href: "/equipment" }, secondary: { label: "Plan a visit", href: "/visit" }, sections: [
    { title: "Digital fabrication", text: "Build precise parts using additive and subtractive processes.", items: ["FDM and resin 3D printing", "Laser cutting and engraving", "CNC machining"] },
    { title: "Electronics and automation", text: "Prototype connected devices and automated systems.", items: ["PCB prototyping", "Embedded systems benches", "Collaborative robotics"] },
  ]},
  make: { title: "Make at BUET FabLab", intro: "A clear path from design review to safe machine access and fabrication.", primary: { label: "Book a machine", href: "/equipment" }, secondary: { label: "Request fabrication", href: "/services/fabrication" }, sections: [
    { title: "Self-service making", text: "Trained members can reserve eligible machines and work with technician support.", items: ["Choose suitable equipment", "Complete required training", "Reserve an available session"] },
    { title: "Fabrication service", text: "Send us a brief when you need the FabLab team to produce the work for you.", items: ["Design feasibility review", "Transparent estimate", "Quality check and collection"] },
  ]},
  learn: { title: "Learn by building", intro: "Practical training makes advanced tools approachable, productive, and safe.", primary: { label: "View training", href: "/training" }, secondary: { label: "Register now", href: "/training/register" }, sections: [
    { title: "Safety first", text: "Every machine pathway begins with lab orientation and process-specific safety." },
    { title: "Skills that transfer", text: "Learn design preparation, machine operation, troubleshooting, and responsible workshop practice." },
  ]},
  research: { title: "Research without fabrication bottlenecks", intro: "Access advanced manufacturing, metrology, and technical expertise for experimental research.", primary: { label: "Propose a collaboration", href: "/research/collaborate" }, secondary: { label: "Explore themes", href: "/research/themes" }, sections: [
    { title: "Research support", text: "We help teams scope methods, select processes, fabricate experiments, and document reproducible workflows." },
    { title: "Shared infrastructure", text: "Use equipment across additive manufacturing, machining, electronics, robotics, and testing." },
  ]},
  "research-themes": { title: "Research themes", intro: "Interdisciplinary work focused on practical manufacturing challenges in Bangladesh and beyond.", primary: { label: "Collaborate with us", href: "/research/collaborate" }, sections: [
    { title: "Sustainable manufacturing", text: "Low-waste processes, local materials, repairability, and circular product systems." },
    { title: "Human-centred engineering", text: "Assistive devices, health technologies, and products designed for real communities." },
    { title: "Automation and robotics", text: "Flexible automation, sensing, controls, and safe human–robot collaboration." },
    { title: "Advanced prototyping", text: "Rapid iteration, novel materials, metrology, and design-for-manufacture research." },
  ]},
  projects: { title: "Projects from our community", intro: "Student, research, and industry teams use the lab to turn ambitious concepts into evidence.", primary: { label: "Start a project", href: "/projects/start" }, sections: [
    { title: "Low-cost prosthetic hand", text: "A student team combined 3D printing, sensors, and electronics to build a functional sub-$100 prototype." },
    { title: "Bamboo composite drone", text: "Researchers reduced chassis weight by 30% using local composite materials and digital fabrication." },
    { title: "Smart irrigation node", text: "A rugged PCB and enclosure design was piloted at five farms to improve water use." },
    { title: "Share your outcome", text: "Completed FabLab projects can be submitted for inclusion in the public gallery." },
  ]},
  facilities: { title: "Facilities designed for the full build cycle", intro: "Move from CAD and electronics to fabrication, assembly, and testing in one connected environment.", primary: { label: "Browse equipment", href: "/equipment" }, secondary: { label: "Request a visit", href: "/visit" }, sections: [
    { title: "Additive Manufacturing Lab", text: "Industrial and desktop FDM and SLA systems with dedicated post-processing." },
    { title: "Digital Subtractive Lab", text: "Laser cutting, CNC routing, and precision milling with extraction and safety controls." },
    { title: "Electronics Lab", text: "PCB prototyping, soldering, instrumentation, embedded development, and rework." },
    { title: "Automation & Robotics Lab", text: "Collaborative robots, machine vision, controls, and flexible automation testbeds." },
  ]},
  training: { title: "Training and certification", intro: "Short, practical courses prepare members to work independently and safely.", primary: { label: "Register for training", href: "/training/register" }, sections: [
    { title: "New member orientation", text: "Lab rules, emergency procedures, material handling, and shared-workspace practice." },
    { title: "Machine pathways", text: "Progress from introductory laser and 3D printing courses to advanced CNC and robotics certification." },
  ]},
  community: { title: "A community of practical innovators", intro: "Meet peers, share knowledge, and build projects that matter.", primary: { label: "Start a project", href: "/projects/start" }, secondary: { label: "Visit the lab", href: "/visit" }, sections: [
    { title: "Students and makers", text: "Develop course projects, thesis prototypes, competition entries, and independent ideas." },
    { title: "Events and showcases", text: "Join build nights, technical talks, demonstrations, and project showcases throughout the year." },
  ]},
  collaborate: { title: "Collaborate with BUET FabLab", intro: "Bring together engineering expertise, advanced facilities, and a focused route to a working prototype.", primary: { label: "Industry partnerships", href: "/collaborate/industry" }, secondary: { label: "Research collaboration", href: "/research/collaborate" }, sections: [
    { title: "For researchers", text: "Develop experimental hardware, new processes, and competitive grant proposals." },
    { title: "For industry", text: "De-risk product ideas through design review, rapid prototyping, and applied R&D." },
  ]},
  about: { title: "About BUET FabLab", intro: "A shared platform for fabrication, research, teaching, and innovation at Bangladesh University of Engineering and Technology.", primary: { label: "Explore facilities", href: "/facilities" }, secondary: { label: "Contact us", href: "/consultation" }, sections: [
    { title: "Our mission", text: "Make modern engineering tools and practical expertise accessible to students, researchers, and partners." },
    { title: "How we work", text: "Safety, openness, responsible innovation, and measurable learning guide every activity in the lab." },
  ]},
  accessibility: { title: "Accessibility", intro: "We want every visitor to access our information, services, and facilities with confidence.", sections: [
    { title: "Digital access", text: "The website supports keyboard navigation, semantic structure, clear focus states, and responsive text." },
    { title: "Facility access", text: "Contact the team before your visit to discuss mobility, communication, or other access needs." },
  ]},
  privacy: { eyebrow: "Policies", title: "Privacy policy", intro: "How BUET FabLab handles information submitted through this prototype.", sections: [
    { title: "Information we collect", text: "We collect only the contact, project, training, and booking details needed to respond to a request." },
    { title: "Use and retention", text: "Information is used for lab operations and retained only as required by BUET policy or applicable law." },
    { title: "Your choices", text: "You may request access, correction, or deletion by contacting the FabLab team." },
  ]},
  terms: { eyebrow: "Policies", title: "Terms of use", intro: "The conditions for using this website and accessing FabLab services.", sections: [
    { title: "Website information", text: "Availability, rates, and examples shown in this draft are demonstration data and must be confirmed by staff." },
    { title: "Lab access", text: "Machine use is subject to membership, training, safety, material, and booking requirements." },
    { title: "Responsible use", text: "Users are responsible for lawful designs, accurate submissions, safe conduct, and respect for intellectual property." },
  ]},
};

export function ContentPage({ page }: { page: keyof typeof pages }) {
  return <PageTemplate {...pages[page]} />;
}
