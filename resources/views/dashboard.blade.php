<x-app-layout>
    <x-slot name="header">Ana Sayfa</x-slot>

    <div class="row">
      <div class="col-md-8">
          <div class="list-group">
              @foreach ($quizzes as $quiz)
                  
              <a href="{{route('quiz.detail', $quiz->slug)}}" class="list-group-item list-group-item-action" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                  <span class="mb-1" style="font-size: 18px;"> {{$quiz->title}} </span>
                  <small> {{$quiz->finished_at ? $quiz->finished_at->diffForHumans().' bitiyor..' : ''}} </small>
                </div>
                <p class="mb-1">{{Str::limit($quiz->description,250)}}</p>
                <small>{{$quiz->questions_count}} Soru Bulunmakta.</small>
              </a>
              @endforeach
              <div class="mt-2">{{$quizzes->links()}}</div>            
          </div>
      </div>
      <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              Quiz Sonuçları
            </div>
            <ul class="list-group list-group-flush">
              @foreach ($results as $result)
              <li class="list-group-item">
                <b>{{$result->point}}</b> -
                <a href="{{route('quiz.detail', $result->quiz->slug)}}">
                  {{$result->quiz->title}}</li>                 
                </a>  
              @endforeach              
            </ul>
          </div>
      </div>
    </div>  

</x-app-layout>
