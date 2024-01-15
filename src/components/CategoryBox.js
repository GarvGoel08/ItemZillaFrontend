import React from "react";
import {Link} from 'react-router-dom'

export default function CategoryBox(props) {
    const CatJSON = props.JSON;
  return (
    <>
      <a href={`/Categories/${CatJSON.categoryName}`} className="button-category" style={{marginTop: '18px', marginRight: '24px'}}>
        <span className="material-symbols-outlined">{CatJSON.categoryIcon}</span>
        <span>{CatJSON.categoryName}</span>
      </a>
    </>
  );
}
