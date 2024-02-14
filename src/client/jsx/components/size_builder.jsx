import React, { useState } from "react";

export class Constraint {
    /**
     * @param {number} max
     * @param {number} min
     * @param {number} value   
    */
     constructor(min, max, value) {
        this.min = min;
        this.max = max;
        this.value = value;
    }
}

/** @type {React.FC<{builder: (width: number) => React.ReactDOM}>} */
export const RawSizeBuilder = ({
    builder,
}) => {
    // 해당 값은 완벽하게 레이아웃의 제약 조건이 될 수 없습니다.
    const [width, setWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
    });

    return (<>{builder(width)}</>)
}

/** @type {React.FC<{constraints: Constraint[], builder: (value: number) => React.ReactDOM}>} */
export const SizeBuilder = ({
    constraints,
    builder
}) => {
    return (
        <RawSizeBuilder builder={(width) => {
            // 주어진 제약 조건에 부합하는 값을 정의합니다.
            const value = constraints.find(e => e.min < width && e.max > width)?.value;
            if (value == null) {
                throw new Error("제약 조건에 부합하는 값을 찾을 수 없습니다, 모든 제약 조건에서 하나 이상의 부합하는 값이 존재해야 합니다.");
            }

            return (<>{builder(value)}</>)
        }} />
    )
}