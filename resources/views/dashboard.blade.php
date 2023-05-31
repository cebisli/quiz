<x-app-layout>
    <x-slot name="header">Ana Sayfa</x-slot>

    <div class="col-md-8">
        <div class="list-group">
            @foreach ($quizzes as $quiz)
                
            <a href="#" class="list-group-item list-group-item-action" aria-current="true">
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
    <div class="col-md-4"></div>

</x-app-layout>
