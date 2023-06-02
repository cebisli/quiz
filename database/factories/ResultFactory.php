<?php

namespace Database\Factories;
use App\Models\Result;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Factories\Factory;

class ResultFactory extends Factory
{
    protected $model = Result::class;
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "user_id" => rand(1,5),
            "quiz_id" => rand(1,10),
            "point" => rand(0,100),
            "currect" => rand(0,20),
            "wrong" => rand(0,20)
        ];
    }
}
