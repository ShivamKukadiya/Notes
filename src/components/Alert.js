import React from 'react'

export const Alert = (props) => {
    const capitalize = (word) => {
        if (word === "danger") {
            word = "error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div className="contaienr">
            {/* props.alert => use:in compiling this statement initlized null and it gaves an error and if we use && then it runs if value is in initlized */}
            {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show position-absolute w-100`} role="alert">
                <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
            </div>}
        </div>
    )
}