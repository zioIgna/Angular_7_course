import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class DataStorageService {
    constructor(
        private httpClient: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
    ) { }

    storeRecipes() {
        const token = this.authService.getToken();
        return this.httpClient.put(
            'https://da-angular-ricettario-semplice.firebaseio.com/recipes.json',
            this.recipeService.getRecipes(),
            { params: new HttpParams().set('auth', token) }
        );
    }

    getRecipes() {
        const token = this.authService.getToken();
        this.httpClient.get<Recipe[]>('https://da-angular-ricettario-semplice.firebaseio.com/recipes.json?auth=' + token)
            .pipe(map(
                (recipes) => {
                    for (let recipe of recipes) {
                        if (!recipe['ingredients']) {
                            console.log(recipe);
                            recipe['ingredients'] = [];
                        }
                    }
                    return recipes;
                }
            ))
            .subscribe(
                (recipes: Recipe[]) => {
                    this.recipeService.setRecipes(recipes);
                }
            );
    }


}