<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 *
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ab_name' => $this->faker->unique()->name,
            'ab_mail' => $this->faker->unique()->safeEmail,
            'ab_password' => '$2y$10$' . $this->faker->regexify('[A-Za-z0-9]{60}')
        ];
    }
}
