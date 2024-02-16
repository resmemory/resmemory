import React, { useLayoutEffect, useRef, useState } from "react";
import { Image } from "../../data/image";

/** @type {React.FC<{src: Image, isLazyLoad: boolean}>} */
export const AsyncImg = ({src, isLazyLoad = false}) => {
    if (src == null) {
        throw new Error("필수 파라미터 [src]의 값이 주어지지 않았습니다.");
    }

    /** @type {React.MutableRefObject<HTMLImageElement>} */
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);
    
    // style={{aspectRatio: `1 / 1`}}
    return (
        <div ref={ref} className={loaded ? undefined : "placeholder"}>
            <img
                onLoad={() => setLoaded(true)}
                src={src.url}
                loading={isLazyLoad ? "lazy" : undefined}
            />
        </div>
    )
}