import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import Logo from '@/components/icons/Logo';
import { useUser } from '@/utils/useUser';

import s from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  return (
    <>
      {
        !user ? (
          <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl" >
            <div className="flex items-center">
              <Sidebar>
                <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
                  {/* @ts-ignore */}
                  <SidebarList userId={session?.user?.id} />
                </React.Suspense>
                <SidebarFooter>
                  <ThemeToggle />
                  <ClearHistory clearChats={clearChats} />
                </SidebarFooter>
              </Sidebar>

              <div className="flex items-center">
                <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
                <UserMenu user={null} />

              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <a
                target="_blank"
                href="https://github.com/vercel/nextjs-ai-chatbot/"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <IconGitHub />
                <span className="hidden ml-2 md:flex">GitHub</span>
              </a>
              <a
                href="https://github.com/vercel/nextjs-ai-chatbot/"
                target="_blank"
                className={cn(buttonVariants())}
              >
                <IconVercel className="mr-2" />
                <span className="hidden sm:block">Deploy to Vercel</span>
                <span className="sm:hidden">Deploy</span>
              </a>
            </div>
          </header >
        ) : (

          <nav className={s.root}>
            <a href="#skip" className="sr-only focus:not-sr-only">
              Skip to content
            </a>
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
                <div className="flex flex-1 items-center">
                  <Link href="/" className={s.logo} aria-label="Logo">
                    <Logo />
                  </Link>
                  <nav className="space-x-2 ml-6 hidden lg:block">
                    <Link href="/" className={s.link}>
                      Pricing
                    </Link>
                    <Link href="/account" className={s.link}>
                      Account
                    </Link>
                  </nav>
                </div>

                <div className="flex flex-1 justify-end space-x-8">
                  {user ? (
                    <span
                      className={s.link}
                      onClick={async () => {
                        await supabaseClient.auth.signOut();
                        router.push('/signin');
                      }}
                    >
                      Sign out
                    </span>
                  ) : (
                    <Link href="/signin" className={s.link}>
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )
      }
    </>
  )
}

export default Navbar;
