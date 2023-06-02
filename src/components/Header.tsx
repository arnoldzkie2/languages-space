import React from 'react';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {
    return (
        <header>
            <h1>LANGUAGES-SPACE</h1>
            <ul>
                <li>HOME</li>
                <li>ABOUT US</li>
                <li>CONTACT US</li>
                <li>SIGN IN</li>
            </ul>
        </header>
    );
};

export default Header;
