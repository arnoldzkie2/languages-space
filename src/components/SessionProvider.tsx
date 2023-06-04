'use client'

import { SessionProvider } from "next-auth/react";

import { ReactNode } from "react";

interface SessionProviderProps {
    children: ReactNode
}

const SessionProviders: React.FC<SessionProviderProps> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>
};

export default SessionProviders;
