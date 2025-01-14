<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\ShoppingCartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ShoppingCartAPIController
{
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'userId' => ['numeric', 'exists:ab_user,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
        // Check if the user is authenticated
        if (!Auth::user() && !$request->input('userId')) {
            return response()->json(['error' => 'Unauthorized users cannot create or access shopping carts'], 401);
        }

        // If no shopping cart exists, create a new one
        $shoppingCart = ShoppingCart::where('ab_creator_id', Auth::user()->id ?? $request->input('userId'))->first();
        if ($shoppingCart && $shoppingCart->exists()) {
            return response()->json(['shoppingCartId' => $shoppingCart->id], 200);
        } else {
            return $this->createShoppingCart($request);
        }
    }

    /**
     * Create a new shopping cart
     * @param Request $request The request
     * @return JsonResponse The response
     */
    public function createShoppingCart(Request $request): JsonResponse
    {
        // Create a new shopping cart
        $shoppingCart = new ShoppingCart();
        $shoppingCart->ab_creator_id = Auth::user()->id ?? $request->input('userId');
        $shoppingCart->save();

        // Respond with the shopping cart ID
        return response()->json(['shoppingCartId' => $shoppingCart->id], 201);
    }

    /**
     * Get the shopping cart items
     * @param Request $request The request
     * @return JsonResponse The shopping cart items
     */
    public function getShoppingCartItems(Request $request): JsonResponse
    {
        // Update the shopping cart ID
        $request->merge(['shoppingCartId' => $request->route('shoppingCartId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'shoppingCartId' => ['required', 'numeric', 'exists:ab_shoppingcart,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Get the shopping cart items
        $shoppingCartItems = ShoppingCartItem::where('ab_shoppingcart_id', $request->route('shoppingCartId'))->get();

        // Respond with the shopping cart items
        return response()->json(['shoppingCartItems' => $shoppingCartItems]);
    }

    /**
     * Add an article to the shopping cart
     * @param Request $request The request
     * @return JsonResponse The response
     */
    public function addArticleToShoppingCart(Request $request): JsonResponse
    {
        // Add the shopping cart ID and article ID to the request
        $request->merge(['shoppingCartId' => $request->route('shoppingCartId'), 'articleId' => $request->route('articleId')]);
        // Validate the request
        $uniqueArticleRule = Rule::unique('ab_shoppingcart_item', 'ab_article_id')->where(function ($query) use ($request) {
            return $query->where('ab_shoppingcart_id', $request->route('shoppingCartId'));
        });
        $validator = Validator::make($request->all(), [
            'articleId' => ['required', 'numeric', 'exists:ab_article,id', $uniqueArticleRule],
            'shoppingCartId' => ['required', 'numeric', 'exists:ab_shoppingcart,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Create a new shopping cart item
        $shoppingCartItem = new ShoppingCartItem();
        $shoppingCartItem->ab_shoppingcart_id = $request->route('shoppingCartId');
        $shoppingCartItem->ab_article_id = $request->input('articleId');
        $shoppingCartItem->save();

        // Respond with success message
        return response()->json(['message' => 'Article added to shopping cart successfully'], 201);
    }

    /**
     * Remove an article from the shopping cart
     * @param Request $request The request
     * @return JsonResponse The response
     */
    public function removeArticleFromShoppingCart(Request $request): JsonResponse
    {
        // Add the shopping cart ID and article ID to the request
        $request->merge(['shoppingCartId' => $request->route('shoppingCartId'), 'articleId' => $request->route('articleId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'articleId' => ['required', 'numeric', 'exists:ab_shoppingcart_item,ab_article_id'],
            'shoppingCartId' => ['required', 'numeric', 'exists:ab_shoppingcart,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Delete the shopping cart item
        ShoppingCartItem::where('ab_shoppingcart_id', $request->route('shoppingCartId'))->where('ab_article_id', $request->route('articleId'))->delete();

        // Respond with success message
        return response()->json(['message' => 'Article removed from shopping cart successfully'], 204);
    }

    /**
     * Remove all articles from the shopping cart
     * @param Request $request The request
     * @return JsonResponse The response
     */
    public function removeArticlesFromShoppingCart(Request $request): JsonResponse
    {
        // Add the shopping cart ID to the request
        $request->merge(['shoppingCartId' => $request->route('shoppingCartId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'shoppingCartId' => ['required', 'numeric', 'exists:ab_shoppingcart,id'],
            'articleIds' => ['array'],
            'articleIds.*' => ['numeric', 'exists:ab_shoppingcart_item,ab_article_id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Select all shopping cart items in the cart
        $deleteRequest = ShoppingCartItem::where('ab_shoppingcart_id', $request->route('shoppingCartId'));
        if ($request->has('articleIds')) {
            // Filter the shopping cart items by the article IDs
            $deleteRequest->whereIn('ab_article_id', $request->input('articleIds'));
        }
        // Delete the remaining shopping cart items
        $deleteRequest->delete();

        // Respond with success message
        return response()->json(['message' => 'Articles removed from shopping cart successfully'], 204);
    }

}
