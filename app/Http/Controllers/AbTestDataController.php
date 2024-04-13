<?php

    namespace App\Http\Controllers;

    use App\Models\AbTestData;
    use Illuminate\Http\Request; // for parameter: (Request $rd)
    class AbTestDataController extends Controller
    {
        public function index() // Stores all entries within ab_testdata table to variable
        {
            return AbTestData::all();
        }

        public function printTestData()
        {
            $ab_testdata = $this->index();
            return $ab_testdata;
        }
    }
?>
