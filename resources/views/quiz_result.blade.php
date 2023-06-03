<x-app-layout>
    <x-slot name="header">{{$quiz->title}} İçin Verilen Cevaplar</x-slot>

    <div class="card">
        <div class="card-body">
            <div class="alert alert-info"  style="font-size:14px;">
                <i class="fa fa-check text-seccess"></i> => Doğru Cevap
                <br>                
                <i class="fa fa-circle"></i>  => Senin Cevabın
                <br>
                <i class="fa fa-times text-danger"></i> => Yanlış Cevap
            </div>  
            <br>  <br>
            @foreach ($quiz->questions as $question)
                @if ($question->correct_answer === $question->my_answer->answer) 
                    <i class="fa fa-check text-seccess"></i>
                @else
                    <i class="fa fa-times text-danger"></i>
                @endif
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
                        <label @if ($answer == $question->correct_answer) class="text-success" @endif style="font-size:14px;">
                            @if ($answer == $question->correct_answer) 
                                <i class="fa fa-check text-seccess"></i> 
                            @elseif ($answer == $question->my_answer->answer)
                                <i class="fa fa-circle"></i> 
                            @endif {{$question->$answer}}
                        </label>
                    </div>
                @endfor                                        
                @if ($loop->iteration < count($quiz->questions))
                    <br>
                    <hr>
                    <br>
                @endif                    
            @endforeach                        
 
        </div>
    </div>

</x-app-layout>
