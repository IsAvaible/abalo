<?php

    // app/Produkt.php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;

    class AbTestData extends \Illuminate\Database\Eloquent\Model
    {
        // Table name:
        protected $table = 'ab_testdata';

        // Name of primary key:
        protected $primaryKey = 'id';
    }
