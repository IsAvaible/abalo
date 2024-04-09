<?php

namespace App\Http\Controllers;

use App\Models\AbTestdata;
use Illuminate\Http\Request;

class AbTestdataController extends Controller
{
    public function index()
    {
        // Fetch all data from the ab_testdata table
        $testdata = AbTestdata::all();
        return response()->json($testdata);
    }
}
