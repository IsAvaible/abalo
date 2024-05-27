<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * This is the model class for the table "ab_shoppingcart_item".
 *
 * @mixin Builder
 */
class ShoppingCartItem extends Model
{
    use HasFactory;

    protected $table = 'ab_shoppingcart_item';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
