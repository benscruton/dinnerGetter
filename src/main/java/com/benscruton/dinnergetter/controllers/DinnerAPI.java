package com.benscruton.dinnergetter.controllers;

import java.util.List;

import com.benscruton.dinnergetter.models.Ingredient;
import com.benscruton.dinnergetter.models.Recipe;
import com.benscruton.dinnergetter.models.SubList;
import com.benscruton.dinnergetter.models.User;
import com.benscruton.dinnergetter.services.AppService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/")
@CrossOrigin("http://localhost:3000")

public class DinnerAPI {
    private final AppService serv;

    public DinnerAPI(AppService s){
        this.serv = s;
    }

    
    //$$$$$$$$$$$
	// Recipes  
	//$$$$$$$$$$$
    
	//======================================================================
    // get all recipes
	//======================================================================
    @GetMapping("recipes")
    public List<Recipe> allRecipes(){
        return this.serv.findAllRecipes();
    }
    
    //======================================================================
    // create a recipe
    //======================================================================
    @PostMapping("recipes/create")
    public Recipe createRecipe(@RequestBody Recipe recipe){
        System.out.println("=========================================================");
        System.out.println(recipe.getName());
        System.out.println(recipe.getSteps());
        System.out.println("=========================================================");
        return this.serv.createRecipe(recipe);
    }
    
    //======================================================================
    // find recipe by name
    //======================================================================
    @PostMapping("recipes/search/name")
    public List<Recipe> findRecipeByName(@RequestBody Recipe recipe ){
        
        System.out.println("&&&&&&&&&&&&&&&&&&&&&&&&&&&" + recipe.getName());
        System.out.println("============================"+ recipe.getName() );
        return this.serv.findRecipeByName(recipe.getName());
    }
    
    //======================================================================
    // find recipe by id
    //======================================================================
    @GetMapping("recipes/{rId}")
    public Recipe findRecipeById(@PathVariable("rId") Long rId){
        return this.serv.findRecipeById(rId);
    }
    
    //$$$$$$$$$$$$$$$$$$$$$
	// Ingredients  
	//$$$$$$$$$$$$$$$$$$$$$
    

    //======================================================================
    // get all ingredients
    //======================================================================
    @GetMapping("ingredients")
    public List<Ingredient> findAllIngredients() {
        return this.serv.findAllIngredients();
    }
    
    //======================================================================
    // create an ingredient
    //======================================================================
    @PostMapping("ingredients/create")
    public Ingredient addIngredient(@RequestBody Ingredient ingredient) { 
        return this.serv.createIngredient(ingredient);
    }
    
    //======================================================================
    // find ingredient by id
    //======================================================================
    @GetMapping("ingredients/{iId}")
    public Ingredient findIngredientById(@PathVariable("iId") Long iId){
        return this.serv.findIngredientById(iId);
    }
    
    //$$$$$$$$$$$$$$$$$$$$$
	// Users  
	//$$$$$$$$$$$$$$$$$$$$$
    
    //======================================================================
    // get all useers
    //======================================================================
    @GetMapping("users")
    public List<User> findAllUsers(){
        return serv.findAllUsers();
    }
    
    //======================================================================
    // find a user by id
    //======================================================================
    @GetMapping("users/{id}")
    public User findUserById(@PathVariable("id") Long id){
        return serv.findUserById(id);
    }
    
    //======================================================================
    // creates a user if not found inside the database
    //======================================================================
    @PostMapping("users/checkdb")  //god damn! POS(&!^*@^!@&^&)  change to user instead of string
    public User checkIfUserExistsAlready(@RequestBody User user){
        System.out.println("%%%%%%%%%% email: "+ user.getEmail() + " inside users/checkdb");
        User u = this.serv.findUserByEmail(user.getEmail());
        if(u != null){
            return u;
        }
        u = new User();
        u.setEmail(user.getEmail());

        u = this.serv.createUser(u);

        SubList sl = new SubList();
        sl.setCategory("uncategorized");
        this.serv.createSubList(u.getEmail(), sl);

        return u;
    }
    
    //======================================================================
    // gets a user by email
    //======================================================================
    @GetMapping("users/email/{email}")
    public User findUserByPathEmail(@PathVariable("email") String email){
        return this.serv.findUserByEmail(email);
    }
    
    
    //$$$$$$$$$$$$$$$$$$$$$$$
	// SUBLISTS
	//$$$$$$$$$$$$$$$$$$$$$$$
    @PostMapping("users/{uEmail}/addsublist")
    public SubList createSubList(@PathVariable("uEmail") String uEmail, @RequestBody SubList sublist){
        return this.serv.createSubList(uEmail, sublist);
    }

    @DeleteMapping("lists/{sId}/delete")
    public void deleteSubList(@PathVariable("sId") Long sId){
        this.serv.deleteSubList(sId);
    }

    @PutMapping("users/{uEmail}/updatesublists")
    public void updateSubLists(@PathVariable("uEmail") String uEmail, @RequestBody String[] idsAndNames){
        this.serv.updateSubListNames(idsAndNames);
    }






    //$$$$$$$$$$$$$$$$$$$$$$$
	// COMBINING THINGS
	//$$$$$$$$$$$$$$$$$$$$$$$
    
    //======================================================================
    // adds an ingredient to a recipe
    //======================================================================
    @PostMapping("/recipes/{rId}/ingredients/{iId}/add")
    public Recipe addIngredientToRecipe(@PathVariable("rId") Long rId, @PathVariable("iId") Long iId){
        return this.serv.addIngredientToRecipe(rId, iId);
    }
    
    //======================================================================
    // adds ingredient array to recipe
    //======================================================================
    @PostMapping("recipes/{rId}/completerelationships")
    public Recipe addIngredientArrayToRecipe(@PathVariable("rId") Long rId, @RequestBody String[] ingredientNames){
        // ******** the first item in ingredientNames is actually the user email ********
        this.serv.addAuthorToRecipe(ingredientNames[0], rId);
        
        for(int j=1; j<ingredientNames.length; j++){
            Ingredient i = new Ingredient();
            i.setName(ingredientNames[j]);
            Ingredient iFromDB = this.serv.createIngredient(i);
            this.serv.addIngredientToRecipe(rId, iFromDB.getId());
        }
        return this.serv.findRecipeById(rId);
    }
    
    //======================================================================
    // saves a recipe ----- to what?!?!?!?!?!?!?
    //======================================================================
    @PostMapping("recipes/{rId}/save")
    public Recipe saveARecipe(@PathVariable("rId")Long rId, String uEmail){
        this.serv.mySavedRecipe(uEmail, rId);
        return this.serv.findRecipeById(rId);
    }
    
    //======================================================================
    // adds an ingredient to a users pantry
    //======================================================================
    @PostMapping("users/{uEmail}/addtopantry")
    public boolean addIngredientToPantry(@PathVariable("uEmail") String uEmail, @RequestBody Ingredient ingredient){
        Ingredient i = this.serv.createIngredient(ingredient);
        User u = this.serv.findUserByEmail(uEmail);
        return this.serv.addIngredientToPantry(u, i);
    }
    
    //======================================================================
    // removes an ingredient from a users pantry
    //======================================================================
    @PostMapping("users/{uEmail}/removefrompantry")
    public void removeIngredientFromPantry(@PathVariable("uEmail") String uEmail, @RequestBody Ingredient ingredient){
        Ingredient i = this.serv.findIngredientByName(ingredient.getName());
        User u = this.serv.findUserByEmail(uEmail);
        this.serv.removeIngredientFromPantry(u, i);
    }
    
    //======================================================================
    // adds ingredient to a users shopping list
    //======================================================================
    // @PostMapping("users/{uEmail}/addtoshoppinglist")
    // public boolean addIngredientToShoppingList(@PathVariable("uEmail") String uEmail, @RequestBody Ingredient ingredient){
    //     Ingredient i = this.serv.createIngredient(ingredient);
    //     User u = this.serv.findUserByEmail(uEmail);
    //     return this.serv.addIngredientToShoppingList(u, i);
    // }
    @PostMapping("lists/{sId}/addingredient")
    public boolean addIngredientToShoppingList(@PathVariable("sId") Long sId, @RequestBody Ingredient ingredient){
        return this.serv.addIngredientToSubList(sId, ingredient);
    }

    @PostMapping("lists/{sId}/removeingredient")
    public int[] removeIngredientFromList(@PathVariable("sId") Long sId, @RequestBody Ingredient ingredient){
        return this.serv.removeIngredientFromList(sId, ingredient.getName());
    }
    
    //======================================================================
    // removes ingredient from shopping list
    //======================================================================
    // @PostMapping("users/{uEmail}/removefromshoppinglist")
    // public int removeIngredientFromShoppingList(@PathVariable("uEmail") String uEmail, @RequestBody Ingredient ingredient){
    //     Ingredient i = this.serv.findIngredientByName(ingredient.getName());
    //     User u = this.serv.findUserByEmail(uEmail);
    //     return this.serv.removeIngredientFromShoppingList(u, i);
    // }

    //======================================================================
    // removes ingredient from shopping list
    //======================================================================
    // @PostMapping("users/{uEmail}/savelistorder")
    // public void saveListOrder(@PathVariable("uEmail") String uEmail, @RequestBody String[] ingredientNames){
    //     this.serv.saveListOrder(uEmail, ingredientNames);
    // }



}
