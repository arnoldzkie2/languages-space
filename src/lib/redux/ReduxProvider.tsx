'use client';

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "./Store";

interface Props {
    children: ReactNode
}

export const ReduxProvider = ({ children }: Props) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}