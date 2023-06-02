<x-app-layout>
    <x-slot name="header">{{$quiz->title}}</x-slot>

    <div class="card">
        <div class="card-body">

                <form action="{{route('quiz.result', $quiz->slug)}}" method="POST">
                    @csrf
                    @foreach ($quiz->questions as $question)
                        <strong style="font-size: 14px;"> #{{$loop->iteration}} - {{$question->question}} </strong>                    
                        <br>
                        @if ($question->image)
                            <img src="{{asset($question->image)}}" class="img-responsive" style="width: 50%; height: 50%;">
                            <br><br>    
                        @endif                    
                        @for ($i = 1; $i < 5; $i++)
                            @php
                                $answer = 'answer'.$i;
                            @endphp
                            <div class="form-check mt-2">
                                <input  type="radio" 
                                        class="form-check-input" 
                                        name="{{$question->id}}" 
                                        id="quiz_{{$question->id}}_{{$i}}" 
                                        value="answer{{$i}}"
                                        required>
                                <label class="form-check-label" for="quiz_{{$question->id}}_{{$i}}">
                                    {{$question->$answer}}
                                </label>
                            </div>
                        @endfor                                        
                        @if ($loop->iteration < count($quiz->questions))
                            <br>
                            <hr>
                            <br>
                        @endif                    
                    @endforeach
                    <div class="d-grid col-6 mx-auto">
                        <button class="btn btn-sm btn-outline-success btn-block" type="submit">Sınavı Bitir</button>
                    </div>                            
                </form>    
 
        </div>
    </div>

</x-app-layout>
