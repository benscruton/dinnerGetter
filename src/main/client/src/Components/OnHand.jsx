import React, { useContext, useState } from 'react';
import MyContext from "../MyContext";
import AddIngredientForm from './AddIngredientForm';
import axios from "axios";



function OnHand(props) {
  const {pantry, setPantry, curUser, setUser} = useContext(MyContext);

  const [ingredient, setIngredient] = useState({name: ""});

  const handleChange = e => {
    setIngredient({ name: e.target.value});
  }

  const addToPantry = (e) => {
    e.preventDefault();
    // ingredient.dummyUserEmail = curUser.email;
    
    axios.post(`http://localhost:8080/api/users/${curUser.email}/addtopantry`, ingredient)
    .then(response => {
        if(response.data){
            setUser({...curUser,
              pantry: [...curUser.pantry, ingredient]
            });
        }
        setIngredient({name: ""});
    }).catch( err => console.log(err));
  }

  const removeFromPantry = (e, ingredient) => {
    ingredient.dummyUserEmail = curUser.email;
    axios.post(`http://localhost:8080/api/users/${curUser.email}/removefrompantry`, ingredient)
    .then(rsp => {
        let pantry = [...curUser.pantry];
        pantry.splice(pantry.indexOf(ingredient), 1);
        setUser({...curUser, pantry});
    }).catch( err => console.log(err));
  }

    return (
        <div className="row">
          <div className="col s10 offset-s1 card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">What Ingredients I Have</span>
              <table className="highlight">
                <thead>
                  {/* <tr className="grey darken-1">
                    <th>Ingredient</th>
                  </tr> */}
                </thead>
                <tbody>
                  <tr className="grey lighten-3"><td style={{padding: "0px",}}>
                    <AddIngredientForm
                      handleChange={handleChange}
                      handleSubmit={addToPantry}
                      ingredient={ingredient}
                      setIngredient={setIngredient}
                    />
                  </td></tr>
                  {curUser.pantry?
                    curUser.pantry.map( (ingredient, idx) =>
                    <tr key={idx}>
                      <td>
                        {ingredient.name}
                        <button
                          className="btn red darken-3 right"
                          onClick={(e) => removeFromPantry(e, ingredient)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                    </tr>
                    )
                  :
                  <tr><td>Loading...</td></tr>}
                    
                </tbody>
              </table>
            </div>
        </div>
        {/* <button className="btn green lighten-3 black-text" onClick={() => console.log(pantry)}>Log Pantry</button> */}
        
      </div>
    )
}

export default OnHand
