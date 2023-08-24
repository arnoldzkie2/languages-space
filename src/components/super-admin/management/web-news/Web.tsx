'use client'
import { RootState } from '@/lib/redux/Store';
import { faDisplay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const Web: React.FC = () => {

    const { isSideNavOpen } = useSelector((state: RootState) => state.globalState)

    const t = useTranslations('side-nav')
    return (
      <div>
        
      </div>  
    );
};

export default Web;
