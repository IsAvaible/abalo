<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 *
 *
 * @property int $id
 * @property string $ab_name
 * @property int $ab_price
 * @property string $ab_description
 * @property int $ab_creator_id
 * @property string $ab_createdate
 * @method static \Illuminate\Database\Eloquent\Builder|Article newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Article newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Article query()
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereAbCreatedate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereAbCreatorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereAbDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereAbName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereAbPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Article whereId($value)
 * @mixin Builder
 */
class Article extends Model
{
    use HasFactory;

    protected $table = 'ab_article';
    protected $primaryKey = 'id';

}
