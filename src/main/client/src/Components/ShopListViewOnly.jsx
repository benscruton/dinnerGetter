import React, {useContext} from "react";
import MyContext from "../MyContext";

const ShopListViewOnly = () => {

  const {curUser} = useContext(MyContext);

  return (
    <ul className="collection">
      <li className="collection-item center blue-grey-text text-darken-1">
        Manage shopping list
      </li>
      {curUser.shoppingList?
        curUser.shoppingList.map( (i, idx) => 
        <li key={idx} className="collection-item left-align blue-grey darken-1 white-text">
          {i.name? i.name : i}
        </li>
        )
        :
        <></>
      }
    </ul>
  );
}

export default ShopListViewOnly;