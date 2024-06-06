<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// interact w/ DB w/o Query Builder or Eloquent ORM

class DevelopmentData extends Seeder
{
    /**
     * Seeds the table with data from a csv file
     * @param string $table The table to seed
     * @param string $filePath The file path to the data
     */
    private function seedTable($table, $filePath): void
    {
        // Read data from file
        $dataMap = array_map(function ($value) {
            return str_getcsv($value, ";");
        },
            file($filePath));

        // Copy first row of data to $attributes and remove it from $dataMap
        // The first row contains the column/attribute names
        $attributes = array_shift($dataMap);
        // Loop through the data
        foreach ($dataMap as $row) {
            $dbData = [];
            // Loop through the attributes
            foreach ($attributes as $attribute => $name) {
                // Clean up data
                if ($name == 'ab_price') {
                    // Remove all dots from the price (they are used as thousand separators)
                    $row[$attribute] = str_replace('.', '', $row[$attribute]);
                }
                if ($row[$attribute] == 'NULL' || $row[$attribute] == 'null') {
                    // Convert 'NULL' or 'null' to NULL
                    $row[$attribute] = NULL;
                }
                if (str_contains($name, 'password')) {
                    // Hash passwords
                    $row[$attribute] = Hash::make($row[$attribute]);
                }

                // Map column name to column value in the row
                $dbData[$name] = $row[$attribute];
            }

            // Insert data into the database table
            DB::table($table)->insert($dbData);
        }
    }

    public function run(): void
    {
        // Define the tables and their data files
        $tables = [
            "ab_user" => __DIR__ . '/data/user.csv', // __DIR__ is current file's directory
            "ab_article" => __DIR__ . '/data/articles.csv',
            "ab_articlecategory" => __DIR__ . '/data/articlecategory.csv',
            "ab_article_has_articlecategory" => __DIR__ . '/data/article_has_articlecategory.csv',
        ];


        foreach ($tables as $table => $filePath) {
            $this->seedTable($table, $filePath);
            // Set the auto increment to the highest id + 1 as it gets out of sync when seeding
            $maxId = DB::table($table)->max('id');
            DB::statement("ALTER SEQUENCE {$table}_id_seq RESTART WITH " . ($maxId + 1));
        }
    }
}
