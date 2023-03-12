import React, { useState, useRef } from "react";
import classes from "./uploadImageInput.module.scss";
import Image from "next/image";

function UploadImageInput({ change }) {
    // StateOf Image Preview
    const [imagePreview, setImagePreview] = useState(null);
    const [imageName, setImageName] = useState(null);

    // Refs
    const fileInputRef = useRef(null);

    // Image Reader Function

    const imageReader = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <div className={classes.FileInput}>
            <label htmlFor='file'>
                <span>قم باختيار صورة</span>
                <span>
                    {imagePreview ? (
                        <Image
                            src={imagePreview || "/test.jpg"}
                            width={100}
                            height={100}
                            alt={"selected image"}
                        />
                    ) : null}
                </span>
            </label>
            <input
                ref={fileInputRef}
                type='file'
                id='file'
                accept='image/*'
                name='file'
                onChange={(e) => {
                    imageReader(e);
                    // Set the name of the Image
                    setImageName(e.target.files[0].name);
                    // Call the change function
                    change(e);
                }}
            />
            {imageName ? <p>{imageName}</p> : null}
        </div>
    );
}

export default UploadImageInput;
