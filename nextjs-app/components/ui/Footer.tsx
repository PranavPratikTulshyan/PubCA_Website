import Link from 'next/link';

const navItems = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Resources',  href: '/resources' },
  { label: 'Learnings',  href: '/learnings' },
  { label: 'My Builts',  href: '/my-builts' },
  { label: 'Talk to Me', href: '/talk-to-me' },
];

const socialLinks = [
  { platform: 'YouTube',   href: 'PLACEHOLDER_YOUTUBE_URL' },
  { platform: 'LinkedIn',  href: 'https://www.linkedin.com/in/capranavptulshyan/' },
  { platform: 'Instagram', href: 'PLACEHOLDER_INSTAGRAM_URL' },
  { platform: 'Discord',   href: 'PLACEHOLDER_DISCORD_INVITE_URL' },
];

function isPlaceholder(href: string): boolean {
  return href.startsWith('PLACEHOLDER');
}

export default function Footer() {
  return (
    <footer className="bg-neutral-800 border-t border-neutral-600 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Col 1: Brand */}
          <div>
            <h3 className="font-heading font-bold text-heading-lg text-neutral-50 mb-2">
              Pranav PT
            </h3>
            <p className="font-body text-body-md text-neutral-400">
              Bringing Technology Closer to Humans!
            </p>
          </div>

          {/* Col 2: Nav links */}
          <div>
            <h4 className="font-heading font-semibold text-body-lg text-neutral-50 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-body-md text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social links */}
          <div>
            <h4 className="font-heading font-semibold text-body-lg text-neutral-50 mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => {
                const placeholder = isPlaceholder(link.href);
                return (
                  <li key={link.platform}>
                    <a
                      href={placeholder ? '#' : link.href}
                      className={`font-body text-body-md transition-colors ${
                        placeholder
                          ? 'text-neutral-600 cursor-not-allowed'
                          : 'text-neutral-400 hover:text-primary-400'
                      }`}
                      {...(!placeholder && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {link.platform}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-600 pt-8">
          <p className="font-body text-body-sm text-neutral-600 text-center">
            © 2026 Pranav PT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
