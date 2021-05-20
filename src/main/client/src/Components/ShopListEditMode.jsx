import React, {useContext, useState} from "react";
import MyContext from "../MyContext";
import GWTH from '../static/img/GWTH.jpg'
import AddIngredientForm from "./AddIngredientForm";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";

const ShopListEditMode = ({handleDrop, storeMode, switchMode, saveListOrder}) => {

  const {curUser, setUser} = useContext(MyContext);
  const [editingCategory, setEditingCategory] = useState(-1);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

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
  const toggleItemCrossed = (slIdx, ingIdx) => {
    if(storeMode){
      let shoppingList = [...curUser.shoppingList];
      shoppingList[slIdx].ingredients[ingIdx].crossedOff = !shoppingList[slIdx].ingredients[ingIdx].crossedOff;
      setUser({...curUser, shoppingList});
    }
  };

  //======================================================================
  // CATEGORY ADD / DELETE / EDIT
  //======================================================================
  const addNewCategory = () => {
    let shoppingList = [...curUser.shoppingList];
    let newCategory = {
      category: "(New Category)",
      formInput: "",
      ingredients: [],
    };
    axios.post(`http://localhost:8080/api/users/${curUser.email}/addsublist`, newCategory)
      .then(rsp => {
        newCategory.id = rsp.data.id;
        shoppingList.push(newCategory);
        setUser({...curUser, shoppingList});
        setEditingCategory(rsp.data.id);
      }).catch(err => console.log(err));
  };
  
  const deleteCategory = (slId, idx) => {
    let shoppingList = [...curUser.shoppingList];
    shoppingList.splice(idx, 1);
    setUser({...curUser, shoppingList});
    axios.delete(`http://localhost:8080/api/lists/${slId}/delete`)
      .catch(err => console.log(err));
    setShowDeleteMessage(false);
  };

  const categoryEditButton = catId => {
    setShowDeleteMessage(false);
    if(editingCategory !== catId){
      setEditingCategory(catId);
      return;
    }
    setEditingCategory(-1);
    let idsAndNames = [];
    for(let i=0; i<curUser.shoppingList.length; i++){
      idsAndNames.push(curUser.shoppingList[i].id);
      idsAndNames.push(curUser.shoppingList[i].category);
    }
    axios.put(`http://localhost:8080/api/users/${curUser.email}/updatesublists`, idsAndNames)
      .catch(err => console.log(err));
  };

  const handleCategoryNameChange = (e, idx) => {
    let shoppingList = [...curUser.shoppingList];
    shoppingList[idx].category = e.target.value;
    setUser({...curUser, shoppingList});
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

          <Droppable key={idx1} droppableId={sublist.category.length ? sublist.category : `i${idx1}`}>
            { provided => (
              <ul className="collection" style={{marginTop: "0px", marginBottom:"0px", backgroundImage: `url(${GWTH})`}} {...provided.droppableProps} ref={provided.innerRef} >
                <li className="collection-item blue-grey darken-1"></li>
                <li className="collection-item center-align blue-grey-text text-darken-1 white">
                  
                  {
                    editingCategory === sublist.id && !storeMode ? 
                      <>
                        {showDeleteMessage? <></> :
                          <i
                            className="material-icons left red-text text-darken-2"
                            style={{cursor: "pointer"}}
                            onClick={() => setShowDeleteMessage(true)}
                          >
                            delete
                          </i>
                        }
                        <div className="input-field inline" style={{margin: "0", padding: "0"}}>
                          <input
                            value={sublist.category}
                            style={{margin: "-10px 0 0", padding: "0"}}
                            onChange={e => handleCategoryNameChange(e, idx1)}
                            autoFocus={true}
                          />
                        </div>
                      </>
                      :
                      sublist.category.toUpperCase()

                  }
                  {storeMode?
                    <></>
                    :
                    <i
                      className="material-icons right"
                      style={{cursor: "pointer"}}
                      onClick={() => categoryEditButton(sublist.id)}
                    >
                      {editingCategory === sublist.id? "done" : "edit"}
                    </i>
                  }
                </li>
                
                { showDeleteMessage && editingCategory === sublist.id ? 
                  <li className="collection-item left-align blue-grey-text text-darken-2 center-align">
                    Deleting this category will also remove all items listed under "{sublist.category}" from your list.  This cannot be undone.
                    <br />
                    Are you sure you wish to continue?
                    <br />

                    <button
                      className="btn waves-effect waves-dark orange lighten-2 black-text"
                      style={{margin: "5px"}}
                      onClick={() => setShowDeleteMessage(false)}
                    >
                      <i className="material-icons left">undo</i>
                      Cancel
                    </button>
                    {/* <i className="material-icons red-text text-darken-2">delete</i>
                    <i className="material-icons yellow-text text-darken-2">cancel</i> */}

                    <button
                      className="btn waves-effect waves-light red darken-2"
                      style={{margin: "5px"}}
                      onClick={e => deleteCategory(sublist.id, idx1)}
                    >
                      <i className="material-icons left">delete</i>
                      Delete
                    </button>
                    
                    

                  </li>
                  :
                  <></>
                }





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
                          onClick={() => toggleItemCrossed(idx1, idx)}
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
                  <li className="collection-item left-align blue-grey-text text-darken-1 row" style={{margin: "0", padding: "0"}}>
                    <div className="input-field white left-align col s10" style={{margin: "0", padding: "0"}}>
                      <i
                        className="material-icons prefix cyan-text text-lighten-2"
                        onClick={() => addIngredient(sublist, idx1)}
                        style={{marginTop: "5px", cursor: "pointer"}}
                      >
                        add_circle
                      </i>

                      <input
                        type="text"
                        className="left-align"
                        value={sublist.formInput}
                        onChange={(e) => handleFormChange(e, idx1)}
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

      <br />
      
      {storeMode? <></> :
        <button
          className="left btn-floating btn-large halfway-fab waves-effect waves-light orange lighten-2 black-text"
          onClick={addNewCategory}
        >
          <i className="material-icons black-text">playlist_add</i>
        </button>
      }
    </>
  );

}

export default ShopListEditMode;