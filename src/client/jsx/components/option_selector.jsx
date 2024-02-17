import React from "react";
import { BottomArrowIcon } from "../../assets/icons/bottom_arrow.jsx";

export class Option {
    /**
     * @param {string} title 
     * @param {VoidFunction} onSelect 
     */
    constructor(title, isSelected, onSelect) {
        this.title = title;
        this.isSelected = isSelected;
        this.onSelect = onSelect;
    }
}

/** @type {React.FC<{selected: Option, options: Option[]}>} */
export const OptionSelector = ({
    type = "tertiary",
    options = [],
}) => {
    const selected = options.find(option => option.isSelected);
    if (selected == null) {
        throw new Error("주어진 옵션 중에서 선택된 상태의 옵션이 존재하지 않습니다.");
    }

    return (
        <button className={type}>{selected.title} <BottomArrowIcon /></button>
    )
}