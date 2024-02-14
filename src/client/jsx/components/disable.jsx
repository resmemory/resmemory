import React from "react";

/**
 * @type {React.FC<{isDisabled: boolean, children: React.ReactDOM}>}
 */
export const Disable = ({
    isDisabled,
    children,
}) => {
    if (isDisabled == null) {
        throw new Error("필수 파라미터 [isDisabled]이(가) 올바르게 주어지지 않았습니다.");
    }

    return (
        <div className={`disable ${isDisabled ? "disabled" : ""}`}>
            {children}
        </div>
    )
}