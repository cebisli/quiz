<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\MainController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth'])->group(function () {
    Route::get('panel', [MainController::class, 'dashboard'])->name('dashboard');
    Route::get('quiz/{slug}', [MainController::class, 'quiz_detail'])->name('quiz.detail');
});

Route::middleware(['auth', 'isAdmin'])->prefix('admin')->group(function () {    
    // quiz Route
    Route::get('quizzes/{id}', [QuizController::class, 'destroy'])->whereNumber('id')->name('quizzes.destroy');    
    Route::resource('quizzes', QuizController::class);

    // question Route
    Route::get('quiz/{quiz_id}/questions/{id}', [QuestionController::class, 'destroy'])->whereNumber('id')->name('questions.destroy');    
    Route::resource('quiz/{quiz_id}/questions', QuestionController::class);
});