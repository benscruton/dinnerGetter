import { navigate } from '@reach/router';
import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';
import M from "materialize-css";
import React, { useContext, useEffect, useState } from "react";
import ShoppingList from "../Components/ShoppingList";
import MyContext from "../MyContext";

const ShoppingPage = () => {
    const { curUser, setUser, shoppingList, setShoppingList, setRedirectLocation, ingredient, setIngredient } = useContext(MyContext);
    const { user } = useAuth0();
    const [counter, setCounter] = useState(0);


    useEffect(() => {
        M.AutoInit();
        if (curUser.email == "") {
            setRedirectLocation("/shopping");
            navigate("/");
        }

        if (!curUser.shoppingList) {
            setShoppingList([]);
            return;
        }
        //=======================================================
        // api post to make sure user exists  -- THIS SHOULD BE HANDLED IN THE LANDING PAD NOW      
        //=======================================================        
        // axios.post('http://localhost:8080/api/users/checkdb', user)
        //     .then(rsp =>{
        //         // console.log(rsp);
        //         // I was just guessing on how the data is going to be returned idk if this below will work
        //         setUser({
        //             firstName: rsp.data.firstName,
        //             lastName: rsp.data.lastName,
        //             email: user.email,
        //             addedRecipes: rsp.data.addedRecipes,
        //             savedRecipes: rsp.data.savedRecipes,
        //             pantry: rsp.data.pantry,
        //             shoppingList: rsp.data.shoppingList
        //         });
        //         // setShoppingList([ ...curUser.shoppingList]);
        //         return rsp;
        //     })
        //     .then(rsp => {
        //         let ingredients = curUser.shoppingList;
        //         for (let i = 0; i < ingredients.length; i++) {
        //             if (typeof ingredients[i] === "number") {
        //                 console.log("HERE IS OUR AXIOS CALL FOR NUMBER", ingredients[i]);
        //                 axios.get(`http://localhost:8080/api/ingredients/${ingredients[i]}`)
        //                     .then(rsp => {
        //                         console.log(rsp.data);
        //                         ingredients.splice(i, 1, rsp.data);
        //                         setUser({
        //                             ...curUser,
        //                             shoppingList: ingredients
        //                         });
        //                         console.log("vvvvvvvvvvvvvvvvvvv" +curUser.shoppingList)
        //                         setShoppingList(ingredients);

        //                     }).catch(err => console.log(err));
        //             }
        //         }
        //         setShoppingList(curUser?.shoppingList);
        //     });
    }, []);


    return (
        <div className="row">

            <div className="col s12 m8 offset-m2 l6 offset-l3">

                <ShoppingList
                    // handleFormSubmit={handleFormSubmit}
                    // handleFormChange={handleFormChange}
                    editable={true}
                />


            </div>
        </div>
    );
}

export default ShoppingPage;