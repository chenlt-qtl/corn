import request from '@/utils/request';
import { stringify } from 'qs';

export async function getRecipe(id: number) {
    return request('/api/food/recipe/' + id);
}

export async function getRecipeList(params: object) {
    return request('/api/food/recipe?' + stringify(params));
}

export async function updateRecipe(params: API.Recipe) {
    return request('/api/food/recipe', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}

export async function createRecipe(params: API.Recipe) {
    return request('/api/food/recipe', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

export async function getIngredient(id: number) {
    return request('/api/food/ingredient/' + id);
}

export async function getIngredientList(params: object) {
    return request('/api/food/ingredient?' + stringify(params));
}

export async function updateIngredient(params: API.Ingredient) {
    return request('/api/food/ingredient', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}

export async function createIngredient(params: API.Ingredient) {
    return request('/api/food/ingredient', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

export async function createRecipeRel(params: API.RecipeRel) {
    return request('/api/food/recipeRel', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}