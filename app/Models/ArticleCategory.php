<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleCategory extends Model
{
    use HasFactory;

    protected $table = 'ab_articlecategory';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'ab_article_has_articlecategory', 'ab_articlecategory_id', 'ab_article_id');
    }
}
