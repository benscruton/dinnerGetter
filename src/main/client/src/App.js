import { useAuth0 } from '@auth0/auth0-react';
import { Router } from "@reach/router";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { useState } from 'react';
import './App.css';
import LandingPad from "./Components/LandingPad";
import LoginButton from "./Components/LoginButton";
import MobileNav from './Components/MobileNav';
import Nav from "./Components/Nav";
import MyContext from './MyContext';
import Home from "./Views/Home";
import RecipePage from "./Views/RecipePage";
import ShoppingPage from "./Views/ShoppingPage";

function App() {
  M.AutoInit();

  const {  isAuthenticated } = useAuth0();

  const [ recipe, setRecipe ] = useState({ name: ""});

  const [ curUser, setUser ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addedRecipes: [],
    savedRecipes: [],
    pantry: [],
    shoppingList: []
  });

  const [ recipes, setRecipes ] = useState([]);
  const [ addedRecipes, setAddedRecipes] = useState(false);
  const [ allRecipes, setAllRecipes ] = useState([]);
  const [ hasBeenPopulated, setHasBeenPopulated ] = useState(false);
  const [ redirectLocation, setRedirectLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className="grey lighten-3">
      <MyContext.Provider value = {{ recipe, setRecipe, curUser, setUser,
        allRecipes, setAllRecipes, addedRecipes, setAddedRecipes, recipes, setRecipes, hasBeenPopulated, setHasBeenPopulated, redirectLocation, setRedirectLocation, searchResults, setSearchResults }}>
        <Nav />
        <MobileNav />
        {isAuthenticated? 
          <Router>
            <LandingPad path="/" />
            <Home path="/dashboard" />
            <RecipePage path="/recipes" />
            <ShoppingPage path="/shopping" />
          </Router>
          :
          // <div className="container ">
              <div className="card card-panel grey lighten-1">
                  <div className="card-content">
                      <LoginButton />
                  </div>
              </div>
          // </div>
        }
      </MyContext.Provider>
    </div>
  );
}

export default App;
