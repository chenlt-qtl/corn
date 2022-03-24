import React from 'react';
import { IRouteComponentProps } from 'umi'
import LoginTimer from "@/components/LoginTimer"

export default function BlankLayout({ children }: IRouteComponentProps) {



    return (
        <>
            <LoginTimer></LoginTimer>
            {children}
        </>
    )
}