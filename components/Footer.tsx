'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SimpleFooter() {
  return (
    <footer className="fixed bottom-0 w-full px-6 py-4 bg-white">
      <div className="text-sm text-center text-gray-400">
        © 2023 SaaSLogo. All rights reserved.
      </div>
    </footer>
  );
}

function DetailedFooter() {
  return (
    <footer className="px-6 py-12 text-white bg-gray-800">
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-lg font-semibold">SaaSLogo</h3>
          <p className="text-sm text-gray-400">Revolutionizing your workflow with cutting-edge SaaS solutions.</p>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">Product</h4>
          <ul className="space-y-2">
            <li><Link href="#features" className="text-sm text-gray-400 hover:text-white">Features</Link></li>
            <li><Link href="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Integrations</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">Company</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Careers</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-lg font-semibold">Support</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Help Center</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</Link></li>
            <li><Link href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 mt-8 text-sm text-center text-gray-400 border-t border-gray-700">
        © 2023 SaaSLogo. All rights reserved.
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/') {
    return <DetailedFooter />;
  }

  return <SimpleFooter />;
}
