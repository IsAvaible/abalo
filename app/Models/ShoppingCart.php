<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * This is the model class for the table "ab_shoppingcart".
 *
 * @mixin Builder
 */
class ShoppingCart extends Model
{
    use HasFactory;

    protected $table = 'ab_shoppingcart';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
