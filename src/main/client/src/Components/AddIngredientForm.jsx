import React from 'react';

export default function AddIngredientForm({ingredient, handleChange, handleSubmit}) {
    
  return (
    <form className="col s12 white" onSubmit={handleSubmit}>
      <div className="row">
        <div className="input-field col s8">
          <input
              id="name"
              type="text"
              className="validate"
              value={ingredient.name}
              onChange={handleChange}
          />
          <label htmlFor="name" >
            Add Ingredient
          </label>
        </div>
        <div className="col s3 offset-s1">
          <button className="waves-effect waves-light btn blue accent-2 right" style={{marginTop: "10px"}} type="submit">
          <i className="material-icons">add_circle_outline</i></button>
        </div>
      </div>
    </form>
  )
}
