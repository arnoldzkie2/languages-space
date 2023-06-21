/* eslint-disable @next/next/no-img-element */
import Header from '@/components/web/Header';
import Main from '@/components/web/Main';
import React from 'react';

interface AppProps {
}

const App: React.FC<AppProps> = ({ }) => {
  return (
    <section className="bg-[url(/web/bg-large.svg)] bg-center bg-no-repeat bg-cover w-screen h-screen flex items-center">
      <Header />
      <Main />
    </section>
  );
};

export default App;


