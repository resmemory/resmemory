import React, { useEffect, useLayoutEffect, useRef } from "react";

export class Listener {
    /**
     * @param {{callback: VoidFunction, children: React.ReactDOM}} 
    */
    static Intersection({callback, children}) {
        /** @type {React.MutableRefObject<HTMLElement>} */
        const ref = useRef(null);

        useLayoutEffect(() => { // init state
            const observer = new IntersectionObserver(entry => {
                if (entry[0].isIntersecting) callback?.call();
            });

            observer.observe(ref.current);
        }, []);
        
        return (
            <div ref={ref}>{children}</div>
        )
    }
}