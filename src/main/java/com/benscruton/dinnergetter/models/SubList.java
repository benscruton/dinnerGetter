package com.benscruton.dinnergetter.models;

// import java.util.List;

// import javax.persistence.Entity;
// import javax.persistence.FetchType;
// import javax.persistence.GeneratedValue;
// import javax.persistence.GenerationType;
// import javax.persistence.Id;
// import javax.persistence.JoinColumn;
// import javax.persistence.JoinTable;
// import javax.persistence.ManyToMany;
// import javax.persistence.ManyToOne;
// import javax.persistence.Table;
// import javax.validation.constraints.NotEmpty;

// import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// @Entity
// @Table(name="sublists")
// @JsonIgnoreProperties({"user"})
public class SubList {
//     @Id
//     @GeneratedValue(strategy=GenerationType.IDENTITY)
//     private Long id;

//     @NotEmpty(message="Category must have a name")
//     private String category;


//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name="user_id")
//     private User owner;

//     @ManyToMany(fetch = FetchType.LAZY)
//     @JoinTable(
//         name = "sublists_ingredients",
//         joinColumns = @JoinColumn(name = "sublist_id"),
//         inverseJoinColumns = @JoinColumn(name = "ingredient_id")
//     )
//     private List<Ingredient> ingredients;



//     public SubList(){}


//     public Long getId() {
//         return this.id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getCategory() {
//         return this.category;
//     }

//     public void setCategory(String category) {
//         this.category = category;
//     }

//     public User getOwner() {
//         return this.owner;
//     }

//     public void setOwner(User owner) {
//         this.owner = owner;
//     }

//     public List<Ingredient> getIngredients() {
//         return this.ingredients;
//     }

//     public void setIngredients(List<Ingredient> ingredients) {
//         this.ingredients = ingredients;
//     }

}
