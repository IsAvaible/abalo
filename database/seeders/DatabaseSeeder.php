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
        $this->call(AbTestdataSeeder::class);
        $this->call(DevelopmentData::class);
        // The MassUserSeeder is commented out because it creates 10,000 users which were only needed for testing purposes.
        // To use it, uncomment the line below and comment out the DevelopmentData::class line above.
        // $this->call(MassUserSeeder::class);
    }
}
