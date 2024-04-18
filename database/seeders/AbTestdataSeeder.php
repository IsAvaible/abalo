<?php

namespace Database\Seeders;

use App\Models\AbTestData;
use Illuminate\Database\Seeder;

class AbTestdataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AbTestData::create(['ab_testname' => 'Fotokamera']);
        AbTestData::create(['ab_testname' => 'Blitzlicht']);
    }
}
