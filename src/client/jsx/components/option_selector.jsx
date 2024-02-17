import React from "react";

export class Option {
    /**
     * @param {string} title 
     * @param {VoidFunction} onSelect 
     */
    constructor(title, onSelect) {
        this.title = title;
        this.onSelect = onSelect;
    }
}

/** @type {React.FC<{options: Option[]}>} */
export const OptionSelector = ({options}) => {
    return (
        <>options</>
    )
}