<?php

    namespace Database\Seeders;

    use Illuminate\Database\Console\Seeds\WithoutModelEvents;
    use Illuminate\Database\Seeder;

// Added: ------------------------------------------------
    use Illuminate\Support\Facades\DB;

    // interact w/ DB w/o Query Builder or Eloquent ORM
    use Illuminate\Support\Facades\Hash;

    // methods for hashing and checking passwords
    use Illuminate\Support\Str;

    // string manipulation methods

    class DevelopmentData extends Seeder
    {
        /**
         * Run the database seeders.
         */
        private function insertData($table, $data)
        {
            $dataMap    = array_map(function ($value)
                          {
                              return str_getcsv($value, ";");
                          },
                          file($data));   // contains all of $data as a map

            $attributes = array_shift($dataMap);                // copies first data row and deletes it from $dataMap
                                                                       // first row contains column/attribute names
            foreach ($dataMap as $row)
            {
                $dbData = [];
                foreach ($attributes as $attribute => $name)
                {
                    // Cleaning database input data

                    if (str_contains($name, 'price')/* $name == 'ab_price' */)
                    {
                        $row[$attribute] = str_replace('.', '', $row[$attribute]);
                    }
                    if ($row[$attribute] == 'NULL' || $row[$attribute] == 'null')
                    {
                        $row[$attribute] = NULL;
                    }
                    if (str_contains($name, 'password'))
                    {
                        $row[$attribute] = Hash::make($row[$attribute]);
                    }

                    // map column name to column value in the row
                    $dbData[$name] = $row[$attribute]; // maybe sub $attribute to $i or $index for clarity
                }

                // Insert data into the database table
                DB::table($table)->insert($dbData);
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

            foreach ($data as $table => $filePath)
            {
                $this->insertData($table, $filePath);
            }
        }
    }
