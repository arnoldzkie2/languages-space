import Header from '@/components/web/Header';
import React from 'react';

interface AppProps {
}

const App: React.FC<AppProps> = ({ }) => {
  return (
    <div className='container'>
      <Header />
    </div>
  );
};

export default App;


