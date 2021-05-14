import React, {useContext, useState} from "react";
import MyContext from "../MyContext";
import GWTH from '../static/img/GWTH.jpg'
import AddIngredientForm from "./AddIngredientForm";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";

const ShopListEditMode = ({handleDrop, storeMode, switchMode, saveListOrder}) => {

  const {curUser, setUser} = useContext(MyContext);

  const [ingredient, setIngredient] = useState({name: ""});
  

  const removeIngredientFromList = (name, idx) => {

    console.log(name);
    let i = {name};
    // i.dummyUserEmail = curUser.email;
    axios.post(`http://localhost:8080/api/users/${curUser.email}/removefromshoppinglist`, i)
      .then( response => {
        console.log(response.data);
        let adjList = [...curUser.shoppingList];
        adjList.splice(idx, 1);
        setUser({...curUser, shoppingList: adjList});
        
      })
      .catch(err => console.log(err));
  }

  //======================================================================
  // ADD / REMOVE INGREDIENT FORM FUNCTIONALITY
  //======================================================================

  const handleFormChange = (e) => {
    setIngredient({ name: e.target.value });
    console.log(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // ingredient.dummyUserEmail = curUser.email;

    // setIngredient({name: ""});
    console.log(ingredient.crossedOff);

    axios.post(`http://localhost:8080/api/users/${curUser.email}/addtoshoppinglist`, ingredient)
      .then((response) => {
        // console.log(response.data);
        if (response.data) {
          let shoppingList = [...curUser.shoppingList];
          ingredient.crossedOff = false;
          shoppingList.push(ingredient);
          setUser({ ...curUser, shoppingList });
        }
        // setShoppingList(response.data);
        // setCounter(counter + 1);
        setIngredient({ name: "" });
      })
      .catch((err) => console.log(err));
  };




  //======================================================================
  // STORE MODE: CROSS OFF INGREDIENT
  //======================================================================
  const toggleItemCrossed = (e, idx) => {
    if(storeMode){
      let shoppingList = [...curUser.shoppingList];

      // e.target.style.cssText = (e.target.style.cssText === ""? "text-decoration: line-through; color: lightgrey;" : "");

      // if(!adjList.crossedOff){
      //   adjList[idx].crossedOff = true;
      // }
      // if(adjList.crossedOff){
      //   adjList[idx].crossedOff = false;
      // }

      shoppingList[idx].crossedOff = !shoppingList[idx].crossedOff;


      setUser({...curUser, shoppingList});
    }
  }

  return (
    <>
      <ul className="collection" style={{marginBottom: "0px"}}>
        <li className="collection-item blue-grey darken-1">
          <div className="switch">
            <label className="white-text">
              EDIT MODE
              <input
                type="checkbox"
                ischecked={storeMode? "true" : "false"}
                onChange={switchMode}
              />
              <span className="lever"></span>
              STORE MODE
            </label>
          </div>
        </li>
        {storeMode?
          <></>
          :
          <>
            {/* <li className="grey lighten-3">
                <AddIngredientForm
                  ingredient={ingredient}
                  handleChange={handleFormChange}
                  handleSubmit={handleFormSubmit}
                />
            </li> */}
            <li className="white">
              <button
                className="btn orange lighten-2 black-text center"
                style={{marginTop: "-10px", marginBottom: "5px"}}
                onClick={saveListOrder}
              >
                <i className="material-icons right">save</i>
                Save List Order
              </button>
            </li>
          </>
        }
      </ul>



      <DragDropContext onDragEnd={handleDrop}>


        {curUser.shoppingList?
          curUser.shoppingList.map( (sublist, idx1) =>

          <Droppable key={idx1} droppableId={sublist.category}>
            { provided => (
              <ul className="collection" style={{marginTop: "0px", marginBottom:"0px", backgroundImage: `url(${GWTH})`}} {...provided.droppableProps} ref={provided.innerRef} >
                <li className="collection-item center-align blue-grey darken-1 white-text">
                  {sublist.category.toUpperCase()}
                </li>
                {
                  sublist.ingredients.map( (i, idx) => 
                    <Draggable 
                      key={idx}
                      draggableId={`${i.name}-${idx}`}
                      index={idx}
                      isDragDisabled={storeMode}
                    >

                        { prov =>
                        <li
                          className="collection-item left-align blue-grey-text text-darken-1"
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          ref={prov.innerRef}
                          // onClick={toggleItemCrossed}
                          >

                          <span
                            style={i.crossedOff? {textDecoration: "line-through", color: "lightgrey"} : {textDecoration: "none"}}
                            onClick={(e) => toggleItemCrossed(e, idx)}
                          >
                            {i.name? i.name : i}
                          </span>

                          {storeMode?
                            <></>
                            : 
                            <button
                              className="btn red darken-2 right"
                              style={{marginTop: "-5px"}}
                              onClick={() => removeIngredientFromList(i.name, idx)}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                          }
                        </li>
                        }

                    </Draggable>
                    )  
                }

                {provided.placeholder}

                {storeMode ?
                  <></>
                  :
                  <li className="grey lighten-3">
                    <AddIngredientForm
                      ingredient={ingredient}
                      handleChange={handleFormChange}
                      handleSubmit={handleFormSubmit}
                    />
                  </li>
                }

              </ul>
            )}
          </Droppable>
          )
          :
          <></>
        }

      </DragDropContext>
    </>
  );

}

export default ShopListEditMode;