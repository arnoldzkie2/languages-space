'use client'
/* eslint-disable @next/next/no-img-element */
import Header from '@/components/web/Header';
import Main from '@/components/web/Main';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

interface AppProps {
}

const App: React.FC<AppProps> = ({ }) => {

  const session = useSession()

  useEffect(() => {

  }, [])

  useEffect(() => {

    if (session.status === 'authenticated') {
      if (session.data.user.type === 'client') {
        redirect('/client')
      } else if (session.data.user.type === 'agent') {
        redirect('/agent')
      } else if (session.data.user.type === 'supplier') {
        redirect('/supplier')
      } else if (session.data.user.type === 'admin') {
        redirect('/admin')
      } else if (session.data.user.type === 'super-admin') {
        redirect('/super-admin')
      }
    }

  }, [session])
  return (
    <>
      <section className="bg-[url(/web/bg-large.svg)] bg-center bg-no-repeat bg-cover w-screen h-screen flex items-center">
        <Header />
        <Main />
      </section>
    </>
  );
};

export default App;

