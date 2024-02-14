import React from "react"



export class Button {
    /**
     * @param {{text: string, isSelected: boolean, onSelect: Function}}
     */
    static Selectable({text, isSelected, onSelect}) {
        return (
            <button
                className={`selectable ${isSelected ? "selected" : ""}`}
                onClick={() => {
                    if (!isSelected) {
                        onSelect()
                    }
                }}
            >{text}</button>
        )
    }

    /**
     * @param {{text: string, onClick: Function, sub: string}} 
     */
    static Tertiary({text, onClick, sub}) {
        return (
            <button className="tertiary" onClick={onClick}>
                {text}
                {sub ? <div className="sub">{sub}</div> : undefined}
            </button>
        )
    }
}