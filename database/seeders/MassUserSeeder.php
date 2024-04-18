<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MassUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10000 users with chunked batch insertion
        $users = User::factory()->count(10000)->make();
        $chunks = $users->chunk(1000);
        foreach ($chunks as $chunk) {
            User::insert($chunk->toArray());
        }
    }
}
