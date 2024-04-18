<?php

namespace App\Http\Controllers;

use App\Models\AbTestData;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Routing\Controller;

class AbTestDataController extends Controller
{
    public function index(): Collection // Stores all entries within ab_testdata table to variable
    {
        return AbTestData::all();
    }
}
