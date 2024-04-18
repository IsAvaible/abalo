<?php

// app/Produkt.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *
 *
 * @method static \Illuminate\Database\Eloquent\Builder|AbTestData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbTestData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbTestData query()
 * @mixin \Eloquent
 */
class AbTestData extends Model
{
    // Table name:
    protected $table = 'ab_testdata';

    // Name of primary key:
    protected $primaryKey = 'id';
}
