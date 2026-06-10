export type Product = {
  id: string;
  code: string;
  name: string;
  category: string;
  shortDescription: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  specs: { label: string; value: string }[];
  features: string[];
  description: string;
  image: string; // icon key
};

const PRODUCTS: Product[] = [
  {
    id: "p-001",
    code: "SMC-X240",
    name: "Heavy-Duty CNC Milling Machine X240",
    category: "Machinery",
    shortDescription: "Precision 5-axis CNC milling for high-tolerance industrial production.",
    price: 184500,
    stock: 12,
    status: "In Stock",
    image: "cog",
    specs: [
      { label: "Model", value: "X240-HD" },
      { label: "Capacity", value: "2400 x 1200 mm" },
      { label: "Dimensions", value: "4.2 x 2.6 x 2.9 m" },
      { label: "Weight", value: "8,400 kg" },
      { label: "Power Requirement", value: "415V / 32 kW / 50Hz" },
      { label: "Warranty", value: "5 years parts & labor" },
    ],
    features: [
      "5-axis simultaneous machining",
      "Active vibration dampening system",
      "Industrial Ethernet & OPC-UA ready",
      "ISO 9001 / CE certified",
    ],
    description:
      "The X240 platform delivers sub-micron precision for aerospace, automotive, and heavy machinery components. Engineered with a cast iron monoblock frame, hydrostatic guideways, and a closed-loop thermal compensation system for 24/7 continuous duty.",
  },
  {
    id: "p-002",
    code: "PWR-IDX-630",
    name: "Industrial Power Switchgear IDX-630",
    category: "Electrical",
    shortDescription: "Low-voltage switchgear with smart monitoring and arc-flash protection.",
    price: 28750,
    stock: 34,
    status: "In Stock",
    image: "bolt",
    specs: [
      { label: "Model", value: "IDX-630" },
      { label: "Capacity", value: "630A / 690V" },
      { label: "Dimensions", value: "2200 x 800 x 600 mm" },
      { label: "Weight", value: "420 kg" },
      { label: "Power Requirement", value: "AC 50/60Hz" },
      { label: "Warranty", value: "3 years" },
    ],
    features: ["IEC 61439 compliant", "Form 4b segregation", "Modbus TCP gateway", "Arc-flash relief"],
    description:
      "Modular low-voltage switchgear platform for substations, data centers, and process plants. Field-configurable bus bars, withdrawable ACBs, and integrated condition monitoring.",
  },
  {
    id: "p-003",
    code: "HYD-PR-90",
    name: "Hydraulic Press PR-90 Series",
    category: "Machinery",
    shortDescription: "90-ton C-frame hydraulic press for stamping and deep-draw forming.",
    price: 42900,
    stock: 8,
    status: "In Stock",
    image: "press",
    specs: [
      { label: "Model", value: "PR-90C" },
      { label: "Capacity", value: "900 kN (90 tons)" },
      { label: "Dimensions", value: "1.8 x 1.2 x 3.1 m" },
      { label: "Weight", value: "3,200 kg" },
      { label: "Power Requirement", value: "415V / 15 kW" },
      { label: "Warranty", value: "2 years" },
    ],
    features: ["Programmable pressure profile", "Two-hand safety control", "CE EN 692 compliant", "Quick-change tooling"],
    description:
      "Rigid C-frame design with stress-relieved welded steel construction. Closed-loop servo-hydraulic control delivers repeatable force and stroke for production stamping lines.",
  },
  {
    id: "p-004",
    code: "ROB-ARM-6X",
    name: "6-Axis Industrial Robotic Arm",
    category: "Automation",
    shortDescription: "210 kg payload articulated robot for welding, palletizing, and assembly.",
    price: 76200,
    stock: 5,
    status: "Low Stock",
    image: "robot",
    specs: [
      { label: "Model", value: "RBX-6.210" },
      { label: "Capacity", value: "210 kg payload" },
      { label: "Dimensions", value: "Reach 2.7 m" },
      { label: "Weight", value: "1,180 kg" },
      { label: "Power Requirement", value: "400V / 7.5 kVA" },
      { label: "Warranty", value: "3 years / 20,000 hrs" },
    ],
    features: ["±0.05 mm repeatability", "IP67 wrist", "TÜV-certified safety controller", "ROS 2 compatible"],
    description:
      "High-payload 6-axis manipulator engineered for spot welding, machine tending, and heavy palletizing in automotive and metal fabrication cells.",
  },
  {
    id: "p-005",
    code: "AIR-CMP-22",
    name: "Rotary Screw Air Compressor 22kW",
    category: "Pneumatics",
    shortDescription: "Variable-speed oil-injected rotary screw compressor with integrated dryer.",
    price: 14600,
    stock: 21,
    status: "In Stock",
    image: "fan",
    specs: [
      { label: "Model", value: "RSC-22V" },
      { label: "Capacity", value: "3.6 m³/min @ 8 bar" },
      { label: "Dimensions", value: "1.6 x 0.9 x 1.4 m" },
      { label: "Weight", value: "640 kg" },
      { label: "Power Requirement", value: "415V / 22 kW" },
      { label: "Warranty", value: "5 years airend" },
    ],
    features: ["VSD inverter drive", "Integrated refrigerant dryer", "Heat-recovery ready", "Whisper-quiet 68 dB(A)"],
    description:
      "Energy-efficient variable-speed compressor delivering stable pressure with up to 35% energy savings compared to fixed-speed units. Suited for machine shops and process facilities.",
  },
  {
    id: "p-006",
    code: "SNS-IOT-T2",
    name: "Industrial IoT Sensor Gateway T2",
    category: "Instrumentation",
    shortDescription: "Edge gateway for vibration, temperature, and process telemetry.",
    price: 1985,
    stock: 142,
    status: "In Stock",
    image: "chip",
    specs: [
      { label: "Model", value: "T2-IIoT" },
      { label: "Capacity", value: "32 channels" },
      { label: "Dimensions", value: "180 x 120 x 60 mm" },
      { label: "Weight", value: "1.2 kg" },
      { label: "Power Requirement", value: "24V DC" },
      { label: "Warranty", value: "2 years" },
    ],
    features: ["MQTT / OPC-UA / Modbus", "LTE-M & Ethernet", "IP65 enclosure", "TLS 1.3 encryption"],
    description:
      "Ruggedized edge gateway for retrofit condition-monitoring of rotating equipment, tanks, and utility lines. Native integration with major SCADA and cloud platforms.",
  },
  {
    id: "p-007",
    code: "BRG-SKF-9320",
    name: "Spherical Roller Bearing 9320",
    category: "Components",
    shortDescription: "High-load self-aligning bearing for heavy industrial drivetrains.",
    price: 412,
    stock: 480,
    status: "In Stock",
    image: "gear",
    specs: [
      { label: "Model", value: "SRB-9320-C3" },
      { label: "Capacity", value: "Dynamic 950 kN" },
      { label: "Dimensions", value: "100 x 215 x 73 mm" },
      { label: "Weight", value: "9.6 kg" },
      { label: "Power Requirement", value: "—" },
      { label: "Warranty", value: "1 year" },
    ],
    features: ["Through-hardened chromium steel", "C3 clearance", "Brass cage option", "ISO 281 rated"],
    description:
      "Precision spherical roller bearing engineered for misalignment-tolerant heavy-duty applications including mining, cement, and pulp & paper.",
  },
  {
    id: "p-008",
    code: "PLC-CTRL-S7",
    name: "Modular PLC Controller S7-Series",
    category: "Automation",
    shortDescription: "High-performance modular PLC for distributed control architectures.",
    price: 3240,
    stock: 67,
    status: "In Stock",
    image: "cpu",
    specs: [
      { label: "Model", value: "S7-1518" },
      { label: "Capacity", value: "32 MB program memory" },
      { label: "Dimensions", value: "175 x 147 x 129 mm" },
      { label: "Weight", value: "0.9 kg" },
      { label: "Power Requirement", value: "24V DC" },
      { label: "Warranty", value: "2 years" },
    ],
    features: ["Profinet IRT", "Integrated motion control", "OPC-UA server", "Hot-swap I/O"],
    description:
      "Enterprise-grade programmable controller for process plants, packaging, and discrete manufacturing lines. Engineered with deterministic real-time performance.",
  },
  {
    id: "p-009",
    code: "VAL-BV-DN150",
    name: "Industrial Ball Valve DN150",
    category: "Components",
    shortDescription: "Stainless steel flanged ball valve for process media.",
    price: 685,
    stock: 0,
    status: "Out of Stock",
    image: "valve",
    specs: [
      { label: "Model", value: "BV-DN150-SS316" },
      { label: "Capacity", value: "PN40 / DN150" },
      { label: "Dimensions", value: "L 290 mm" },
      { label: "Weight", value: "28 kg" },
      { label: "Power Requirement", value: "—" },
      { label: "Warranty", value: "1 year" },
    ],
    features: ["SS316 body", "PTFE seats", "API 6D compliant", "Fire-safe design"],
    description:
      "Heavy-duty floating ball valve for oil & gas, chemical, and water treatment service. ISO 5211 mounting pad for actuator integration.",
  },
  {
    id: "p-010",
    code: "MTR-IE4-55",
    name: "IE4 Premium Efficiency Motor 55kW",
    category: "Electrical",
    shortDescription: "Super-premium efficiency three-phase induction motor.",
    price: 5240,
    stock: 18,
    status: "In Stock",
    image: "motor",
    specs: [
      { label: "Model", value: "M3BP-250-IE4" },
      { label: "Capacity", value: "55 kW @ 1485 rpm" },
      { label: "Dimensions", value: "Frame 250M" },
      { label: "Weight", value: "385 kg" },
      { label: "Power Requirement", value: "400V / 50Hz" },
      { label: "Warranty", value: "3 years" },
    ],
    features: ["IE4 Super Premium", "Cast iron frame", "F-class insulation", "IP55 protection"],
    description:
      "High-efficiency three-phase induction motor optimized for pumps, fans, compressors, and conveyor drives in continuous industrial service.",
  },
  {
    id: "p-011",
    code: "WLD-MIG-500",
    name: "Inverter MIG/MAG Welder 500A",
    category: "Tools",
    shortDescription: "Heavy-duty inverter welder for structural and pipeline fabrication.",
    price: 4180,
    stock: 26,
    status: "In Stock",
    image: "spark",
    specs: [
      { label: "Model", value: "MIG-500i" },
      { label: "Capacity", value: "500A @ 60% duty" },
      { label: "Dimensions", value: "720 x 340 x 590 mm" },
      { label: "Weight", value: "62 kg" },
      { label: "Power Requirement", value: "415V 3-phase" },
      { label: "Warranty", value: "2 years" },
    ],
    features: ["Synergic pulse mode", "Digital memory channels", "Water-cooled torch ready", "CE / EN 60974"],
    description:
      "Professional multi-process inverter welding source for shipyards, fabrication shops, and infrastructure projects.",
  },
  {
    id: "p-012",
    code: "CRN-OH-10T",
    name: "Overhead Bridge Crane 10-Ton",
    category: "Machinery",
    shortDescription: "Double-girder overhead bridge crane system for plant material handling.",
    price: 96400,
    stock: 3,
    status: "Low Stock",
    image: "crane",
    specs: [
      { label: "Model", value: "OHC-10T-DG" },
      { label: "Capacity", value: "10,000 kg SWL" },
      { label: "Dimensions", value: "Span up to 28 m" },
      { label: "Weight", value: "12,500 kg" },
      { label: "Power Requirement", value: "415V" },
      { label: "Warranty", value: "3 years" },
    ],
    features: ["FEM 2m duty class", "Variable-frequency drives", "Radio remote", "Anti-sway control"],
    description:
      "Engineered double-girder overhead crane with variable-frequency long-travel, cross-travel, and hoist drives. Designed for steel mills, fabrication shops, and warehousing.",
  },
];

export const products = PRODUCTS;
export const categories = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export const industries = [
  { name: "Automotive", icon: "Car" },
  { name: "Oil & Gas", icon: "Flame" },
  { name: "Power & Energy", icon: "Zap" },
  { name: "Mining & Metals", icon: "Mountain" },
  { name: "Chemical & Process", icon: "FlaskConical" },
  { name: "Food & Beverage", icon: "Wheat" },
  { name: "Construction", icon: "HardHat" },
  { name: "Aerospace", icon: "Plane" },
];

export const testimonials = [
  {
    name: "Rajesh Mehta",
    title: "Plant Director, Northstar Forgings Ltd.",
    quote:
      "We sourced our entire 2024 CNC retrofit through this platform. Technical documentation, lead times, and support were on par with our tier-1 OEM partners.",
  },
  {
    name: "Anika Visser",
    title: "VP Procurement, Helix Petrochemical",
    quote:
      "Compliance certificates, MTC reports, and traceability were available before purchase. That alone cut our vendor qualification cycle by six weeks.",
  },
  {
    name: "Daniel O'Brien",
    title: "Operations Lead, Vanguard Aerospace",
    quote:
      "Premium catalog, transparent pricing for capex equipment, and serious account managers. This is how industrial procurement should work.",
  },
];

export const stats = [
  { value: "12,400+", label: "Industrial SKUs" },
  { value: "85", label: "Countries Served" },
  { value: "ISO 9001", label: "Certified Supply Chain" },
  { value: "24/7", label: "Technical Support" },
];

export const orders = [
  { id: "ORD-10482", customer: "Northstar Forgings Ltd.", date: "2026-06-04", amount: 184500, status: "Processing" as const },
  { id: "ORD-10481", customer: "Helix Petrochemical", date: "2026-06-04", amount: 28750, status: "Shipped" as const },
  { id: "ORD-10480", customer: "Vanguard Aerospace", date: "2026-06-03", amount: 76200, status: "Delivered" as const },
  { id: "ORD-10479", customer: "Apex Mining Co.", date: "2026-06-03", amount: 42900, status: "Pending" as const },
  { id: "ORD-10478", customer: "Continental Steelworks", date: "2026-06-02", amount: 14600, status: "Delivered" as const },
  { id: "ORD-10477", customer: "Meridian Power Systems", date: "2026-06-02", amount: 96400, status: "Processing" as const },
  { id: "ORD-10476", customer: "Bluewater Refining", date: "2026-06-01", amount: 5240, status: "Shipped" as const },
  { id: "ORD-10475", customer: "Granite Construction", date: "2026-05-31", amount: 4180, status: "Delivered" as const },
];

export const customers = [
  { name: "Northstar Forgings Ltd.", email: "procurement@northstarforgings.com", orders: 42, spending: 1840500 },
  { name: "Helix Petrochemical", email: "supply@helixpetro.com", orders: 31, spending: 1290340 },
  { name: "Vanguard Aerospace", email: "buying@vanguardaero.com", orders: 28, spending: 982600 },
  { name: "Apex Mining Co.", email: "ops@apexmining.com", orders: 24, spending: 765200 },
  { name: "Continental Steelworks", email: "purchasing@contisteel.com", orders: 19, spending: 542300 },
  { name: "Meridian Power Systems", email: "ops@meridianpower.com", orders: 17, spending: 498400 },
  { name: "Bluewater Refining", email: "supply@bluewaterref.com", orders: 14, spending: 312700 },
];

export const coupons = [
  { code: "ENTERPRISE10", discount: "10%", expiry: "2026-12-31", status: "Active" as const },
  { code: "Q3-VOLUME25", discount: "25% (volume tier)", expiry: "2026-09-30", status: "Active" as const },
  { code: "FREIGHT-FREE", discount: "Free freight", expiry: "2026-08-15", status: "Active" as const },
  { code: "LAUNCH2025", discount: "15%", expiry: "2025-12-31", status: "Expired" as const },
  { code: "PARTNER-NET30", discount: "Net-30 terms", expiry: "2026-12-31", status: "Active" as const },
];

export const salesData = [
  { month: "Jan", revenue: 1240000, orders: 86 },
  { month: "Feb", revenue: 1380000, orders: 94 },
  { month: "Mar", revenue: 1520000, orders: 102 },
  { month: "Apr", revenue: 1410000, orders: 96 },
  { month: "May", revenue: 1685000, orders: 118 },
  { month: "Jun", revenue: 1842000, orders: 127 },
];
