import React, { FC, ReactNode } from "react"



export const Masonry = ({
    rows,
    gap = "0px",
    rowGap = gap,
    columnGap = gap,
    children,
}) => {
    const childArray = React.Children.toArray(children);
    const byRow      = new Map();

    {
        let count = 0;
        for (const child of childArray) {
            const index = count++ % rows;
            
            byRow.set(index, [byRow.get(index), child] ?? [child]);
        }
    }
    
    return (
        <div style={{
            display: "flex",
            gap: rowGap,
        }}>
            {Array(rows).fill(null).map((_, i) => {
                return (
                    <div key={i} style={{
                        display: "flex",
                        flexDirection: "column",
                        width: `${(1 / rows) * 100}%`,
                        gap: columnGap,
                    }}>{byRow.get(i)}</div>
                );
            })}
        </div>
    )
}