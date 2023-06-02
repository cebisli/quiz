<x-app-layout>
    <x-slot name="header">{{$quiz->title}}</x-slot>

    <div class="card">
        <div class="card-body">
            <p class="card-text">

                <div class="row">
                    <div class="col-md-4">
                        <ol class="list-group list-group-numbered">
                            @if ($quiz->finished_at)
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Son Katılım Tarihi</div>                                
                                    </div>
                                    <span class="badge bg-secondary rounded-pill" title="{{$quiz->finished_at}}"> {{$quiz->finished_at->diffForHumans()}} </span>
                                </li>     
                            @endif                            
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">Soru Sayısı</div>                                
                                </div>
                                <span class="badge bg-secondary rounded-pill"> {{$quiz->questions_count}} </span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">Katılımcı Sayısı</div>                                
                                </div>
                                <span class="badge bg-secondary rounded-pill">14</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">Ortalama Puan</div>
                                </div>
                                <span class="badge bg-secondary rounded-pill">60</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">Subheading</div>                                
                                </div>
                                <span class="badge bg-secondary rounded-pill">14</span>
                            </li>
                        </ol>
                    </div>
                    <div class="col-md-8">
                        {{$quiz->description}}  
                        <br>
                        <a href="{{route('quiz.join', $quiz->slug)}}" class="btn btn-primary btn-block btn-sm" style="width: 100%">Quize Katıl</a>
                    </div>
                </div>                
            </p>          
        </div>
      </div>

</x-app-layout>
