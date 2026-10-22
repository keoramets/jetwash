// Photos on the public site. Files are in public/images/photos.
//
// For now these are free stock photos from Unsplash (Unsplash License: free for commercial use, no credit required;
// https://unsplash.com/license). They show the kind of work JetWash does. They are NOT JetWash's own jobs, staff or
// equipment, so never caption them as JetWash work and never use them for projects or results.
// Third-party logos and phone numbers in them were blurred out. Replace them with JetWash's own photos when the
// company sends them, and keep this list up to date (who took each photo and where it came from).
export const photos = {
  hero: {
    src: '/images/photos/hero.jpg',
    alt: 'A worker in a high-visibility vest cleaning a building with a high-pressure water hose',
    by: 'Brian Kungu',
    source: 'https://unsplash.com/photos/FyXGw0TfQGE',
  },
  factoryJet: {
    src: '/images/photos/factory-jet.jpg',
    alt: 'A high-pressure water jet cleaning a factory wall',
    by: 'Bernd Dittrich',
    source: 'https://unsplash.com/photos/lBSBec8ngZM',
  },
  powerWasher: {
    src: '/images/photos/power-washer.jpg',
    alt: 'Paving cleaned with a mobile pressure washer',
    by: 'Bin White',
    source: 'https://unsplash.com/photos/-DuSeZkWnqs',
  },
  plant: {
    src: '/images/photos/industrial-plant.jpg',
    alt: 'Pipework and towers at an industrial plant',
    by: 'Jakub Żerdzicki',
    source: 'https://unsplash.com/photos/TKJffuIcZu4',
  },
};

// One photo per service in lib/company.js, by slug.
export const servicePhotos = {
  'high-pressure-cleaning': {
    src: '/images/photos/high-pressure-cleaning.jpg',
    alt: 'A worker cleaning a pavement with a high-pressure washer',
    by: 'Adrian Raudaschl',
    source: 'https://unsplash.com/photos/e2k842P9a2I',
  },
  'industrial-machinery-maintenance': {
    src: '/images/photos/industrial-machinery-maintenance.jpg',
    alt: 'Workers in hard hats maintaining a large industrial gear',
    by: 'Kenny',
    source: 'https://unsplash.com/photos/nJo5fYZ_OK0',
  },
  'boiler-and-tank-cleaning': {
    src: '/images/photos/boiler-and-tank-cleaning.jpg',
    alt: 'Stainless steel tanks and pipework in a processing plant',
    by: 'Crystal Kwok',
    source: 'https://unsplash.com/photos/xD5SWy7hMbw',
  },
  'fuel-tanker-degassing': {
    src: '/images/photos/fuel-tanker-degassing.jpg',
    alt: 'Stainless steel fuel tanker trailers in a yard',
    by: 'Jason Mitrione',
    source: 'https://unsplash.com/photos/dcdIVHpFDus',
  },
  'drain-and-sewer-unblocking': {
    src: '/images/photos/drain-and-sewer-unblocking.jpg',
    alt: 'A sewer cleaning truck and crew working on a city street',
    by: 'Filip Chmielecki',
    source: 'https://unsplash.com/photos/muis5J8rO5s',
  },
  'commercial-and-residential-cleaning': {
    src: '/images/photos/commercial-and-residential-cleaning.jpg',
    alt: 'A ride-on floor scrubber cleaning a large hall',
    by: 'Bin White',
    source: 'https://unsplash.com/photos/INDGbj_ojG4',
  },
};

const isPlaceholder = (url) => !url || url.includes('/images/placeholders/');

// The photo for a service: the one set in the admin, if any, otherwise the photo for its slug.
export function serviceImage(service) {
  if (!isPlaceholder(service?.imageUrl)) return { src: service.imageUrl, alt: service.name };
  return servicePhotos[service?.slug] || photos.plant;
}
