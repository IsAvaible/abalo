<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\data\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(DevelopmentData::class); // added by Dennis
    }
}
