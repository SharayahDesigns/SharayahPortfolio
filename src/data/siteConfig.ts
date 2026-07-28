export const siteConfig = {
  name: 'Sharayah Hefner',
  origin: 'https://sharayahdesigns.com',
  email: 'SharayahDesigns@gmail.com',
  title: 'Frontend UX Engineer & Design Engineer',
}

export type NavItem = {
  label: string
  href: string
  section?: string
  route?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Work', href: '/#projects', section: 'projects' },
  { label: 'About', href: '/#about', section: 'about' },
  { label: 'Experience', href: '/#experience', section: 'experience' },
  { label: 'Skills', href: '/#skills', section: 'skills' },
  { label: 'Contact', href: '/#contact', section: 'contact' },
  { label: 'Résumé', href: '/resume', route: true },
]

export const resumePdfPath = '/Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf'
export const resumePdfFilename = 'Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf'
