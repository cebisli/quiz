<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'image', 
        'answer1', 
        'answer2', 
        'answer3', 
        'answer4', 
        'correct_answer'
    ];

    protected $appends = ['true_percent'];

    public function getTruePercentAttribute()
    {   
        $answer_count = $this->answers()->get()->count();    
        $true_answer = $this->answers()->where('answer', $this->correct_answer)->count();    

        if ($true_answer > 0)
            return round((100 / $answer_count) * $true_answer);
        else
            return 0;    
    }

    public function answers()
    {        
        return $this->hasMany('App\Models\Answer');    
    }

    public function my_answer(){
        return $this->hasOne('App\Models\Answer')->where('user_id', auth()->user()->id);
    }

}
