import React, { useId } from "react";
import classes from "./CustomSelect.module.scss";

// Imports
import Select from "react-select";

function CustomSelect({ change, label, arrOfValue, selectedValue, disabled }) {
    return (
        <Select
            className={classes.Select}
            classNamePrefix={classes.Select}
            theme={(theme) => {
                return {
                    ...theme,
                    borderRadius: 5,
                    colors: {
                        ...theme.colors,
                        primary25: "#e0e3ff",
                        primary: "#6571ff",
                    },
                };
            }}
            placeholder={label}
            options={arrOfValue}
            value={selectedValue}
            isDisabled={disabled}
            isRtl
            isClearable
            onChange={change}
            instanceId={useId()}
            styles={{
                placeholder: (base) => {
                    return {
                        ...base,
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        outline: "none",
                    };
                },
                singleValue: (base) => {
                    return {
                        ...base,
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        outline: "none",
                    };
                },
                control: (base) => {
                    return {
                        ...base,
                        fontSize: "14px",
                        boxShadow: "none",
                    };
                },
                option: (base) => {
                    return {
                        ...base,
                        fontSize: "14px",
                        cursor: "pointer",
                        paddingTop: "1rem",
                        paddingBottom: "1rem",
                    };
                },
            }}
        />
    );
}

export default CustomSelect;
