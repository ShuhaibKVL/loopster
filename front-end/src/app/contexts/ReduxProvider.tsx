'use client'

import { Provider } from "react-redux";
import store from "@/lib/store/store";
import React from "react";

const ReduxProvider : React.FC<{children:React.ReactNode}> =({children}) => {
    return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider