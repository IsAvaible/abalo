<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 *
 * @mixin Builder
 */
class User extends Model
{
    use HasFactory;
    protected $table = 'ab_user';
    protected $primaryKey = 'id';
    public $timestamps = false;
}
