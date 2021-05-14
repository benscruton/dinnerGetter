import { useAuth0 } from '@auth0/auth0-react';
import { navigate } from "@reach/router";
import axios from 'axios';
import React, { useContext } from "react";
import MyContext from "../MyContext";

const LandingPad = () => {
    const { curUser, setUser, setPantry, setUserIngredientList, redirectLocation, setShoppingList, shoppingList} = useContext(MyContext);
    const { user, isAuthenticated } = useAuth0();

    //======================================================================
    // checks if user is authenticated. if they are then it checks and/or adds user to the local database
    //======================================================================
    if (isAuthenticated) {
        axios.post('http://localhost:8080/api/users/checkdb', user)
        .then(rsp =>{
            console.log(rsp);
            // I was just guessing on how the data is going to be returned idk if this below will work
            
            //======================================================================
            // sets user in context
            //======================================================================
                let pantry = rsp.data.pantry;
                for(let i=0; i<pantry.length; i++){
                    if(typeof pantry[i] === "string"){
                        let name = pantry[i];
                        pantry[i] = {name};
                    }
                }

                // let shoppingList = rsp.data.shoppingList;
                // for(let i=0; i<shoppingList.length; i++){
                //     if(typeof shoppingList[i] === "string"){
                //         let name = shoppingList[i];
                //         shoppingList[i] = {name};
                //         shoppingList[i].crossedOff = false;
                //     }
                // }

                let catList = rsp.data.categorizedShoppingList;
                let shoppingList = [];
                for(let i=0; i<catList.length; i++){
                    
                    let ingredients = [];

                    for(let j=0; j<catList[i].ingredients.length; j++){
                        let ing = catList[i].ingredients[j];
                        if(typeof ing === "string"){
                            let name = ing;
                            ing = {name};
                        }
                        ing.crossedOff = false;
                        ingredients.push(ing);
                    }

                    let sublist = {
                        category: catList[i].category,
                        ingredients
                    };
                    shoppingList.push(sublist);
                }
                console.log(catList);


            
                setUser({
                    firstName: rsp.data.firstName,
                    lastName: rsp.data.lastName,
                    email: user.email,
                    addedRecipes: rsp.data.addedRecipes,
                    savedRecipes: rsp.data.savedRecipes,
                    pantry,
                    shoppingList
                });
                // // set the user ingredient list, which has to be a string to make the external api call
                // let pantryNames = rsp.data.pantry.map( i => (i.name));
                // console.log(pantryNames);
                // let templist = "";
                // for(let i = 0; i < rsp.data.pantry; i ++){
                //     // setUserIngredientList(userIngredientList = userIngredientList + "," + curUser.pantry[i].name);
                //     templist += rsp.data.pantry[i].name + ","
                // }
                // setUserIngredientList(templist);
                // // console.log(curUser.pantry);
                // console.log(templist);
                // // console.log(userIngredientList);
                return rsp;
            })
            // .then(rsp=>{
            //     let ingredients = curUser.shoppingList;
            //     for (let i = 0; i < ingredients.length; i++) {
            //         if (typeof ingredients[i] === "number") {
            //             console.log("HERE IS OUR AXIOS CALL FOR NUMBER", ingredients[i]);
            //             axios.get(`http://localhost:8080/api/ingredients/${ingredients[i]}`)
            //                 .then(rsp => {
            //                     console.log(rsp.data);
            //                     ingredients.splice(i, 1, rsp.data);
            //                     setUser({
            //                         ...curUser,
            //                         shoppingList: ingredients
            //                     });
            //                     console.log("vvvvvvvvvvvvvvvvvvv" +curUser.shoppingList)
            //                     setShoppingList(ingredients);
        
            //                 }).catch(err => console.log(err));
            //         }
            //     }
            // }
            // )
            // .then((rsp) =>{

            //     let tempPantry = [...curUser.pantry];
                
            //     let templist = "";
            //     for(let i = 0; i < tempPantry.length; i ++){
            //         if(typeof tempPantry[i] === "number"){
            //             // console.log("HERE IS OUR AXIOS CALL FOR NUMBER", ingredients[i]);
            //             axios.get(`http://localhost:8080/api/ingredients/${tempPantry[i]}`)
            //                 .then(rsp => {
            //                     tempPantry.splice(i, 1, rsp.data);
            //                     setUser({...curUser,
            //                         pantry: tempPantry
            //                     });
            //                     setPantry(tempPantry);
            //                     templist += rsp.data.name.toLowerCase() + ",";
            //                 }).catch(err => console.log(err));
            //         } else {
            //             templist += curUser.pantry[i].name.toLowerCase() + ",";
            //         }
            //     }
            //     setUserIngredientList(templist.substring(0, templist.length - 1));
            //     console.log(templist.substring(0, templist.length - 1));
            // })
            .then(() => {
                navigate(redirectLocation? redirectLocation : "/dashboard");
            })
            .catch( e => console.error({errors: e}));
    }

    return (
        isAuthenticated && (
            <div className="container card-panel grey lighten-1">
                <div className="card">
                    <div className="card-content">
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue">
                                <div className="circle-clipper left">
                                <div className="circle"></div>
                                </div><div className="gap-patch">
                                <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                <div className="circle"></div>
                                </div>
                            </div>

                            <div className="spinner-layer spinner-red">
                                <div className="circle-clipper left">
                                <div className="circle"></div>
                                </div><div className="gap-patch">
                                <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                <div className="circle"></div>
                                </div>
                            </div>

                            <div className="spinner-layer spinner-yellow">
                                <div className="circle-clipper left">
                                <div className="circle"></div>
                                </div><div className="gap-patch">
                                <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                <div className="circle"></div>
                                </div>
                            </div>

                            <div className="spinner-layer spinner-green">
                                <div className="circle-clipper left">
                                <div className="circle"></div>
                                </div><div className="gap-patch">
                                <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default LandingPad;