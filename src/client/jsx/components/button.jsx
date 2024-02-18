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
     * @param {{text: string, onClick: Function, isNew: boolean}} 
     */
    static Tertiary({text, onClick, isNew}) {
        return (
            <button className={`tertiary ${isNew ? "new" : ""}`} onClick={onClick}>
                {text}
            </button>
        )
    }
}