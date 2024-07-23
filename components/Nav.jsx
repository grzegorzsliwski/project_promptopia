"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Nav = () => {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response); // Now it correctly calls the state setter
      setLoading(false);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return null; // or a loading spinner
  }

  const signOutAndNavigateToHome = async () => {
    signOut({
      callbackUrl: '/'
    });
  };

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image 
          src="/assets/images/logo.svg" 
          alt="Promtopia Logo" 
          width={30} 
          height={30} 
          className='object-contain' />
        <p className="logo_text">Promptopia</p>     
      </Link>

      {/* DESKTOP NAVIGATION */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt" className="black_btn">
              Create Post
            </Link>
            <button type="button" onClick={signOutAndNavigateToHome} className="outline_btn">
              Sign Out
            </button>
            <Link href="/profile">
              <Image 
                src={session?.user.image} 
                width={37} 
                height={37} 
                className="rounded-full" 
                alt="profile" />
            </Link>
          </div>
        ) : (
          <>
            {providers && Object.values(providers).map((provider) => (
              <button 
                type="button" 
                key={provider.name} 
                onClick={() => signIn(provider.id)} 
                className='black_btn'>
                Sign In
              </button>
            ))}
          </>
        )}
      </div>

      {/* MOBILE NAVIGATION */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image 
              src={session?.user.image} 
              width={37} 
              height={37} 
              className="rounded-full" 
              alt="profile" 
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}>
                  My Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}>
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOutAndNavigateToHome();
                  }}
                  className="mt-5 w-full black_btn">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers && Object.values(providers).map((provider) => (
              <button type="button" 
                key={provider.name} 
                onClick={() => signIn(provider.id)} 
                className='black_btn'>
                Sign In
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
