// JetWash company facts and services. Every line here is what JetWash has confirmed; keep it that way.
// Contact details live in the environment (COMPANY_* in .env); see lib/seo.js.
export const company = {
  name: 'JetWash (Pvt) Ltd',
  founded: 1998,
  summary:
    'JetWash (Pvt) Ltd is a Zimbabwean industrial cleaning and maintenance company established in 1998. It specialises in high-pressure cleaning, industrial machinery maintenance, boiler and tank cleaning, fuel tanker degassing, drain and sewer unblocking, and commercial and residential cleaning.',
  commitment:
    'JetWash is committed to delivering reliable, efficient and high-quality cleaning solutions using specialised equipment and industry expertise.',
};

export const yearsInBusiness = () => new Date().getFullYear() - company.founded;

// [name, slug, category, short description]
export const services = [
  ['High-Pressure Cleaning', 'high-pressure-cleaning', 'Industrial', 'High-pressure water cleaning for equipment, floors, tanks, vehicles and building surfaces.'],
  ['Industrial Machinery Maintenance', 'industrial-machinery-maintenance', 'Industrial', 'Cleaning and maintenance of production machinery, so it keeps running safely and efficiently.'],
  ['Boiler and Tank Cleaning', 'boiler-and-tank-cleaning', 'Specialised', 'Removing scale, sludge and residue from boilers, storage tanks and vessels.'],
  ['Fuel Tanker Degassing', 'fuel-tanker-degassing', 'Specialised', 'Degassing fuel tankers and tanks so they can be safely inspected, repaired or cleaned.'],
  ['Drain and Sewer Unblocking', 'drain-and-sewer-unblocking', 'Infrastructure', 'Clearing blocked drains and sewer lines.'],
  ['Commercial and Residential Cleaning', 'commercial-and-residential-cleaning', 'Commercial', 'Cleaning for offices, shops, commercial premises and homes.'],
];
