<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\ShoppingCartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ShoppingCartAPIController
{
    public function index(Request $request): JsonResponse
    {
        return $this->createShoppingCart($request);
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
        $shoppingCart->ab_creator_id = $request->user()->id ?? 1;
        $shoppingCart->save();

        // Respond with the shopping cart ID
        return response()->json(['shoppingCartId' => $shoppingCart->id]);
    }

    /**
     * Get the shopping cart items
     * @param Request $request The request
     * @return JsonResponse The shopping cart items
     */
    public function getShoppingCart(Request $request): JsonResponse
    {
        // Update the shopping cart ID
        $request->merge(['shoppingCartId' => $request->route('shoppingCartId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'shoppingCartId' => ['required', 'numeric', 'exists:ab_shoppingcart,id'],
        ]);

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
}
