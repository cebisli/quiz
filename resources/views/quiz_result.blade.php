<x-app-layout>
    <x-slot name="header">{{$quiz->title}} İçin Verilen Cevaplar</x-slot>

    <div class="card">
        <div class="card-body">
            <span style="font-size: 20px;">Puan : <strong>{{$quiz->my_result->point}}</strong></span>
            <div class="alert alert-info"  style="font-size:14px;">
                <i class="fa fa-check text-seccess"></i> => Doğru Cevap
                <br>                
                <i class="fa fa-circle"></i>  => Senin Cevabın
                <br>
                <i class="fa fa-times text-danger"></i> => Yanlış Cevap
            </div>  
            <br> 
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">                    
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </symbol>
            </svg>
            @foreach ($quiz->questions as $question)            
                <div class="d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="15" height="15" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
                    <div style="font-size:14px;">
                        Bu soruya <b> %{{$question->true_percent}} </b> oranında doğru cevap vermiştir.
                    </div>
                </div>  

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
                    <hr>
                    <br>
                @endif                    
            @endforeach                        
 
        </div>
    </div>

</x-app-layout>
