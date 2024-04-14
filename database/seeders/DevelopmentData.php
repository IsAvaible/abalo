<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// Added: ------------------------------------------------
use Illuminate\Support\Facades\DB;      // interact w/ DB w/o Query Builder or Eloquent ORM
use Illuminate\Support\Facades\Hash;    // methods for hashing and checking passwords
use Illuminate\Support\Str;             // string manipulation methods

class DevelopmentData extends Seeder
{
    /**
     * Run the database seeders.
     */
    private function insertData($table, $data)
    {
        $dataMap = array_map('str_getcsv', file($data));   // contains all of $data as a map
        $attributes = array_shift($dataMap);                // copies first data row and deletes it from $dataMap
                                                                   // first row contains column/attribute names
        foreach ($dataMap as $row)
        {
            $data = [];
            foreach ($attributes as $attribute => $name) {
                // map column name to column value in the row
                $data[$name] = $row[$attribute]; // maybe sub $attribute to $i or $index for clarity
            }

            // Insert data into the database table
            DB::table($table)->insert($data);
        }
    }

    public function run(): void
    {
        // Table, data file (path)
        $data = [
            "ab_user" => __DIR__ . '/data/user.csv', // __DIR__ is current file's directory
            "ab_article" => __DIR__ . '/data/articles.csv',
            "ab_articlecategory" => __DIR__ . '/data/articlecategory.csv'
        ];

        foreach($data as $table => $filePath)
        {
            $this->insertData($table, $filePath);
        }
    }
}
