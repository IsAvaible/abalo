<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ab_articlecategory', function (Blueprint $table) {
            $table->id();
            $table->string("ab_name", 100)->nullable(false)->unique();
            $table->string("ab_description", 1000)->nullable(true); // "nullable" is implied by default, but helps w/ readability
            // $table->integer("ab_parent")->nullable(true);
            $table->unsignedBigInteger('ab_parent')->nullable();
            $table->foreign('ab_parent')->references('id')->on('ab_articlecategory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ab_articlecategory');
    }
};
