import React from "react";

export class Align {
    /**
     * @param {{children: React.ReactDOM}} 
     */
    static Horizontal({children}) {
        return (
            <div style={{margin: "0 auto"}}>{children}</div>
        )
    }
}