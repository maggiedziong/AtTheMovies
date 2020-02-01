import React from "react";

const FilterGenre = (props) => {

  return (
    <div>
      <h3> {props.name} </h3>
      <div className="filters__display">
        <div className="filters__display__inner">
          {props.filter.map(el => (
            <div 
              className={`filter ${props.stateFilter.includes(el.name) ? "selected" : ""}`} 
              onClick={() => {props.filterAction(el.name)}} 
              key={el.id}>{el.name}</div>            
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterGenre;