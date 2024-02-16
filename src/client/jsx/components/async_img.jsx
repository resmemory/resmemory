import React, { useLayoutEffect, useRef, useState } from "react";
import { Image } from "../../data/image";

/** @type {React.FC<{src: Image, isLazyLoad: boolean}>} */
export const AsyncImg = ({src, isLazyLoad = false}) => {
    if (src == null) {
        throw new Error("필수 파라미터 [src]의 값이 주어지지 않았습니다.");
    }

    const aspectRatio = (src.height / src.width) * 100;

    /** @type {React.MutableRefObject<HTMLImageElement>} */
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);

    return (
        <div 
            className={loaded ? undefined : "placeholder"} 
            style={{
                display: "flex", 
                width: '100%', 
                paddingBottom: `${aspectRatio}%`, 
                position: 'relative'
            }}
        >
            <img
                ref={ref}
                width="100%"
                height="100%"
                onLoad={() => setLoaded(true)}
                src={src.url}
                loading={isLazyLoad ? "lazy" : undefined}
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0 
                }}
            />
        </div>
    )
}