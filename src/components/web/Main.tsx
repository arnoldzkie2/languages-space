/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import React from 'react';

interface MainProps {
}

const Main: React.FC<MainProps> = ({ }) => {
    return (
        <div className='px-24 w-full flex justify-between items-center'>
            <div className='flex flex-col gap-6 w-1/2'>
                <h1 className='text-white text-5xl font-extralight'>Boost your spoken english instantly!</h1>
                <h2 className='text-slate-50 leading-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati impedit fugit
                    voluptate laborum molestiae consequatur voluptatem consectetur sapiente, porro
                    similique? Reiciendis iusto soluta facilis atque laborum. Nulla voluptatem quos sed.</h2>
                <button className='bg-white text-blue-600 hover:bg-transparent border border-white hover:text-white w-1/3 py-2 rounded-3xl shadow-md'>START LEARN NOW</button>
            </div>
            <div className='flex justify-center items-center gap-5 w-1/2'>
                <img src="/web/hero.png" alt="Teacher" className='w-2/3 bg-white shadow-xl rounded-full' />
            </div>
        </div>
    );
};

export default Main;