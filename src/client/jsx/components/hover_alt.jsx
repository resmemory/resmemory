import React, { useEffect, useLayoutEffect, useRef } from "react";

const delay = 150; // ms

/** @type {React.FC<{text: string, children: React.ReactDOM}>} */
export const HoverAlt = ({
    text,
    children
}) => {
    /** @type {React.MutableRefObject<HTMLElement>} */
    const ref = useRef(null);

    useLayoutEffect(() => {
        const body = document.getElementsByTagName("body")[0];
        const element = ref.current;
        
        let timer;
        element.onpointerenter = () => {
            element.onpointerleave = () => { clearTimeout(timer ?? undefined); }
            
            timer = setTimeout(() => {
                console.log("hello world");
            }, delay);
        }
    }, []);

    return (
        <div ref={ref}>{children}</div>
    )
}