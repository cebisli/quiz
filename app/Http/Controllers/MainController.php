<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\Answer;
use App\Models\Result;

class MainController extends Controller
{
    public function dashboard(){
        $quizzes = Quiz::where('status', 'publish')->withCount('questions')->paginate(5);
        return view('dashboard', compact('quizzes'));
    }

    public function quiz($slug){
        $quiz = Quiz::whereSlug($slug)->with('questions')->first() ?? abort(404, 'Quiz Bulunamadı'); 
        return view('quiz', compact('quiz'));
    }

    public function quiz_detail($slug){
        $quiz = Quiz::whereSlug($slug)->with('my_result', 'topTen.user')->withCount('questions')->first() ?? abort(404, 'Quiz Bulunamadı');                
        return view('quiz_detail', compact('quiz'));
    }

    public function result(Request $request, $slug)
    {
        $quiz = Quiz::with('questions')->whereSlug($slug)->first() ?? abort(404, 'Quiz Bulunamadı');        
        
        if ($quiz->my_result)
            abort(404, 'Bu quize daha önce katıldınız...');

        $soruSayisi = count($quiz->questions);
        $currect = 0;
        foreach ($quiz->questions as $question) {
            $userAnswer = $request->post($question->id);
            Answer::create([
                "user_id" => auth()->user()->id,
                "question_id" => $question->id,
                "answer" => $userAnswer
            ]);

            if ($question->correct_answer === $userAnswer)
                $currect+=1;
        }

        $point = (100 / $soruSayisi) * $currect;

        Result::create([
            "user_id" => auth()->user()->id,
            "quiz_id" => $quiz->id,
            "point" => round($point),
            "currect" => $currect,
            "wrong" => $soruSayisi-$currect
        ]);

        return redirect()->route('quiz.detail', $quiz->slug)->withSuccess("Quizi Başarıyla Bitirdiniz... Puanın : $point");
    }
}
