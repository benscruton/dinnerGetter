import React, {useContext, useState} from "react";
import MyContext from "../MyContext";
import GWTH from '../static/img/GWTH.jpg'
import AddIngredientForm from "./AddIngredientForm";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";

const ShopListEditMode = ({handleDrop, storeMode, switchMode, saveListOrder}) => {

  const {curUser, setUser} = useContext(MyContext);

  //======================================================================
  // ADD / REMOVE INGREDIENT FORM FUNCTIONALITY
  //======================================================================

  const handleFormChange = (e, idx) => {
    let shoppingList = [...curUser.shoppingList];
    shoppingList[idx].formInput = e.target.value;
    setUser({...curUser, shoppingList});
  };

  const addIngredient = (sl, idx) => {
    let ingredient = {name: sl.formInput};
    axios.post(`http://localhost:8080/api/lists/${sl.id}/addingredient`, ingredient)
      .then(rsp => {
        let shoppingList = [...curUser.shoppingList];
        shoppingList[idx].formInput = "";
        if(rsp.data){
          ingredient.crossedOff = false;
          shoppingList[idx].ingredients.push(ingredient);
        }
        setUser({...curUser, shoppingList});
      })
      .catch(err => console.log(err));
  };

  const removeIngredient = (slId, slIdx, name, ingIdx) => {
    let i = {name};
    axios.post(`http://localhost:8080/api/lists/${slId}/removeingredient`, i)
      .then(() => {
        let shoppingList = [...curUser.shoppingList];
        let adjList = shoppingList[slIdx];
        adjList.ingredients.splice(ingIdx, 1);
        shoppingList[slIdx] = adjList;
        setUser({...curUser, shoppingList});
      })
      .catch(err => console.log(err));
  };


  //======================================================================
  // STORE MODE: CROSS OFF INGREDIENT
  //======================================================================
  // const toggleItemCrossed = (e, idx) => {
  //   if(storeMode){

  //     let shoppingList = [...curUser.shoppingList];

  //     shoppingList[idx].crossedOff = !shoppingList[idx].crossedOff;


  //     setUser({...curUser, shoppingList});
  //   }
  // }

  const toggleItemCrossedOuter = (slIdx, ingIdx) => {
    if(storeMode){
      let shoppingList = [...curUser.shoppingList];
      shoppingList[slIdx].ingredients[ingIdx].crossedOff = !shoppingList[slIdx].ingredients[ingIdx].crossedOff;
      setUser({...curUser, shoppingList});
    }
  };

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
                <li className="collection-item blue-grey darken-1"></li>
                <li className="collection-item center-align blue-grey-text text-darken-1 white">
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
                          onClick={() => toggleItemCrossedOuter(idx1, idx)}
                          >

                          <span
                            style={i.crossedOff?
                              {
                                cursor: (storeMode? "default" : "inherit"),
                                textDecoration: "line-through",
                                color: "lightgrey"
                              }
                              :
                              {
                                cursor: (storeMode? "default" : "inherit"),
                                textDecoration: "none"
                              }
                            }
                          >
                            {i.name}
                          </span>

                          {storeMode?
                            <></>
                            : 
                            <span
                              className="red-text text-darken-2 right"
                              style={{cursor: "default"}}
                              onClick={() => removeIngredient(sublist.id, idx1, i.name, idx)}
                            >
                              <i className="material-icons">delete</i>
                            </span>
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
                  <li className="collection-item left-align blue-grey-text text-darken-1"  style={{margin: "0", padding: "0"}}>
                    <div className="file-input input-field row" style={{margin: "0", padding: "0"}}>
                      <div className="col s2">
                        <button
                          className="btn waves-effect waves-light blue accent-2"
                          onClick={() => addIngredient(sublist, idx1)}
                          style={{marginTop: "5px"}}
                        >
                          <i className="material-icons">add_circle_outline</i>
                        </button>
                      </div>
                      <input
                        value={sublist.formInput}
                        onChange={(e) => handleFormChange(e, idx1)}
                        className="left-align col s8 offset-s1"
                      />
                    </div>
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