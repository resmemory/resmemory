import React from "react"



export const Center = ({
    children
}) => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div style={{
                maxWidth:  "100%", // parent width
                maxHeight: "100%", // parent height
                overflow: "auto",
            }}>
                {children}
            </div>
        </div>
    )
}
