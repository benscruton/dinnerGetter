// import { useAuth0 } from "@auth0/auth0-react";
import React, {useState, useContext} from 'react';
import axios from "axios";
import MyContext from "../MyContext";
import ShopListEditMode from "./ShopListEditMode";
import ShopListViewOnly from "./ShopListViewOnly";


const ShoppingList = ({editable}) => {
  // const {user, isAuthenticated, isLoading } = useAuth0();
  const {curUser, setUser} = useContext(MyContext);
  const [storeMode, setStoreMode] = useState(false);

  //======================================================================
  // LIST EDITING, INCLUDING DRAG-AND-DROP FUNCTIONALITY
  //======================================================================
  const handleDrop = move => {
    if(!move.destination) return;
    let adjList = [...curUser.shoppingList];

    const [movedItem] = adjList.splice(move.source.index, 1);
    adjList.splice(move.destination.index, 0, movedItem);

    setUser({...curUser, shoppingList:adjList});
  }

  const switchMode = () => {
    setStoreMode(!storeMode);
  }

  const saveListOrder = () => {
    let listOrder = [...curUser.shoppingList];
    let names = listOrder.map(x => x.name);
    axios.post(`http://localhost:8080/api/users/${curUser.email}/savelistorder`, names)
      .then(response => {
        console.log(response);
      }).catch(err => console.log(err));
  }


  

  // e.target.style.cssText

  // if (isLoading) return(<div>Loading...</div>)
    return (
      <div className="row">
        <div className="col s10 offset-s1 card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Shopping List</span>

              {editable? 
                <ShopListEditMode
                  handleDrop={handleDrop}
                  storeMode={storeMode}
                  // toggleItemCrossed={toggleItemCrossed}
                  switchMode={switchMode}
                  saveListOrder={saveListOrder}
                />
                :
                <ShopListViewOnly
                  curUser={curUser}
                />
              }

          </div>
        </div>
      </div>
    );  
}

export default ShoppingList