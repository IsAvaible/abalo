<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ab_article_has_articlecategory', function (Blueprint $table) {
            $table->id();

            // Reference ab_articlecategory
            $table->unsignedBigInteger('ab_articlecategory_id')->nullable(false);
            $table->foreign('ab_articlecategory_id')->references('id')->on('ab_articlecategory');

            // Reference ab_article
            $table->unsignedBigInteger("ab_article_id")->nullable(false);
            $table->foreign('ab_article_id')->references('id')->on('ab_article');

            // Variable that uses logic (controller later on) to concatenate both values
            $table->unsignedBigInteger("ab_UNIQUE_article_AND_category")->nullable(false)->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ab_article_has_articlecategory');
    }
};
