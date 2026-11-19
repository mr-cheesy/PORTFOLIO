// All content lives here. GitHub and LinkedIn are still placeholders — replace them.

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'lab', label: 'Lab' },
  { id: 'contact', label: 'Contact' },
]

export const LINKS = {
  email: { href: 'mailto:mr.cheesy019@gmail.com', label: 'mr.cheesy019@gmail.com' },
  github: { href: 'https://github.com/', label: 'GitHub' }, // PLACEHOLDER — add your profile URL
  linkedin: { href: 'https://www.linkedin.com/', label: 'LinkedIn' }, // PLACEHOLDER — add your profile URL
}

export const PROJECTS = [
  {
    n: '01',
    id: 'osint',
    title: 'OSINT Infomap',
    category: 'Geospatial Intelligence / OSINT',
    desc: 'An exploration of our world through public data, interactive maps and real-time information.',
    tags: ['React', 'FastAPI', 'Python', 'OpenSky'],
    href: 'https://osint-infomap.netlify.app',
    cta: 'VISIT LIVE SITE',
  },
  {
    n: '02',
    id: 'lockin',
    title: 'LOCKIN',
    category: 'Student Productivity Workspace',
    desc: 'A workspace built for students — one calm place to plan, focus and get things done.',
    tags: [],
    href: null,
    cta: 'LINK COMING',
  },
  {
    n: '03',
    id: 'space',
    title: 'NASA Space Apps Challenge 2026',
    category: 'Team Project',
    desc: 'A project built for the NASA Space Apps Challenge 2026, exploring innovative solutions to space-related challenges.',
    tags: [],
    href: 'https://poetic-palmier-14a29c.netlify.app',
    cta: 'VISIT LIVE SITE',
  },
]

export const STACK = [
  { title: 'Languages', k: 0.2, speed: 60, items: ['Python', 'JavaScript', 'HTML', 'CSS', 'CircuitPython'] },
  { title: 'Frameworks', k: 0.33, speed: -45, items: ['React', 'Vite', 'FastAPI'] },
  { title: 'Tools', k: 0.46, speed: 35, items: ['Git', 'GitHub', 'VS Code', 'ESP32'] },
]

export const LAB = [
  {
    n: '01',
    title: '3D on the web',
    desc: 'Three.js and WebGL — scroll-driven scenes like the one behind this page.',
  },
  {
    n: '02',
    title: 'Live public data',
    desc: 'Open feeds such as OpenSky, and how to turn them into maps people can explore.',
  },
  {
    n: '03',
    title: 'Student tooling',
    desc: 'What makes a study workspace actually help — the thinking behind LOCKIN.',
  },
  {
    n: '04',
    title: 'Motion & interface',
    desc: 'Smooth scrolling, line systems, and how movement can guide attention.',
  },
]
