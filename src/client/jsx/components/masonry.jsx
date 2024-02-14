import React, { FC, ReactNode, useLayoutEffect, useState } from "react"



/** @type {React.FC<{rows: number, gap: number, rowGap: number, columnGap: number, padding: string, children: React.ReactDOM}>} */
export const Masonry = ({
    rows,
    gap = "0px",
    rowGap = gap,
    columnGap = gap,
    padding,
    children,
}) => {
    const childArray = React.Children.toArray(children);

    /** @type {Map<number, React.ReactNode>} */
    const byRow = new Map();

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
            padding: padding,
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