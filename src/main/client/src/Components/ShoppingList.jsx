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
    console.log("hello");
    console.log(move);
    if(!move.destination) return;

    if(move.destination.droppableId === move.source.droppableId){
      // moving within same list
      let fullList = [...curUser.shoppingList];
      let catnames = fullList.map(sublist => sublist.category);
      let listIdx = catnames.indexOf(move.destination.droppableId);

      let adjList = [...fullList[listIdx].ingredients];

      const [movedItem] = adjList.splice(move.source.index, 1);
      adjList.splice(move.destination.index, 0, movedItem);

      fullList[listIdx].ingredients = adjList;

      setUser({...curUser,
        shoppingList: fullList
      });
      return;
    }


    else{
      // moving between lists
      let fullList = [...curUser.shoppingList];
      let catnames = fullList.map(sublist => sublist.category);
      let srcIdx = catnames.indexOf(move.source.droppableId);
      let destIdx = catnames.indexOf(move.destination.droppableId);

      let adjSrcList = [...fullList[srcIdx].ingredients];
      let adjDestList = [...fullList[destIdx].ingredients];

      const [movedItem] = adjSrcList.splice(move.source.index, 1);
      adjDestList.splice(move.destination.index, 0, movedItem);

      fullList[srcIdx].ingredients = adjSrcList;
      fullList[destIdx].ingredients = adjDestList;

      setUser({...curUser,
        shoppingList: fullList
      });
      return;
    }





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