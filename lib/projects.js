// JetWash project stories for /projects. Empty until JetWash sends real, approved jobs: never invent clients, results
// or figures (CLAUDE.md), and never use stock photos for projects (lib/photos.js). While this list is empty, /projects
// says the stories are on their way. Adding the first one? See components/public/ProjectDetailPage.js for its page.
//
// Each project:
// {
//   slug: 'boiler-clean-example',        // the page address: /projects/<slug>
//   title: '...', category: '...',        // category: one of the services in lib/company.js
//   summary: '...', description: '...',
//   imageUrl: '/images/projects/<file>',  // JetWash's own photo, in public/images/projects
//   clientName: '...',                    // only with the client's approval; otherwise leave it out
//   location: '...', completionDate: '2026-05-31',
//   isFeatured: false,
//   metrics: { 'Downtime saved': '2 days' }, // only figures JetWash has confirmed
// }
export const projects = [];
