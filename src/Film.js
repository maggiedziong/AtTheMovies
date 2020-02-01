import React from "react";

const Film = (props) => {

    const style = {
        backgroundImage: 'url(' + props.image + ')',
        backgroundSize: 'cover',
        backgroundColor: 'black'
    };

    return (
        <div className='movie'>
           <h3>{props.title}</h3>
           
            <div className="movie__poster" style={style}>
                <span className="rating">{props.rating} / 10</span>
            </div>
     
             <div className="movie__genres">
                {props.genre.map(genre => {
                    return <span key={genre}>{genre}</span>
                })}
            </div>
        </div>
    )
}

export default Film;