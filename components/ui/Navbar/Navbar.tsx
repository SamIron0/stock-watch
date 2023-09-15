import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Logo from '@/components/icons/Logo';

import s from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">

          <div className="flex flex-1 justify-end space-x-8">

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;