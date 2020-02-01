import React from "react";

const FilterRating = (props) => {
  return (
    <div>
      <h3>{props.name}</h3>
      <div className="filters__display">
        <div className="filters__display__inner">
          {props.filter.map(el => (
            
            <div
              className={`filter ${props.stateFilter  === el ? "selected" : ""}`} 
              onClick={() => {props.filterAction(el)}} 
              key={el}>{el}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterRating;