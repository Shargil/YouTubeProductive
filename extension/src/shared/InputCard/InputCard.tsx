import Title from "antd/lib/typography/Title";
import React from "react"

import "./InputCard.scss"

export function InputCard({ title, checked, imgPath, points }): JSX.Element {
    // ----- State -----

    // ----- Hooks -----

    // ----- Extra Functions -----

    // ----- On Events -----
    return (
        <div className={checked ? "card checked" : "card"}>
            <div className="header-container">
                <Title style={{ fontSize: "20px", marginTop: "16px" }}>{title}</Title>
                <img src={imgPath} alt="regular focus"></img>
            </div>
            <ul>
                {points.map((point) =>
                    <li key={point.toString()}>{point}</li>
                )}
            </ul>
        </div>
    );
}