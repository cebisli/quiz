<x-app-layout>
    <x-slot name="header">{{$quiz->title}}</x-slot>

    <div class="card">
        <div class="card-body">
            <p class="card-text"> 
                
                @foreach ($quiz->questions as $question)
                    <strong style="font-size: 14px;"> #{{$loop->iteration}} - {{$question->question}} </strong>                    
                    <br><br>
                    @for ($i = 1; $i < 5; $i++)
                        @php
                            $answer = 'answer'.$i;
                        @endphp
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="{{$question->id}}" id="quiz_{{$question->id}}_{{$i}}" value="{{$question->$answer}}">
                            <label class="form-check-label" for="quiz_{{$question->id}}_{{$i}}">
                                {{$question->$answer}}
                            </label>
                        </div>
                    @endfor                                        
                    <br>
                    <hr>
                    <br>
                @endforeach

            </p>          
        </div>
    </div>

</x-app-layout>
