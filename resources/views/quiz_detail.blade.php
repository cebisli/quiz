<x-app-layout>
    <x-slot name="header">{{$quiz->title}}</x-slot>

    <div class="card">
        <div class="card-body">
            <p class="card-text">

                <div class="row">
                    <div class="col-md-4">
                        <ol class="list-group list-group-numbered" style="font-size: 13px;">
                            @if ($quiz->my_result)
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Puan</div>                                
                                    </div>
                                    <span class="badge bg-success rounded-pill"> {{$quiz->my_result->point}} Puan </span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Doğru / Yanlış Sayısı</div>                                
                                    </div>
                                    <span class="badge bg-success rounded-pill"> {{$quiz->my_result->currect}} Doğru</span> / 
                                    <span class="badge bg-danger rounded-pill"> {{$quiz->my_result->wrong}} Yanlış </span>
                                </li>
                            @endif                            

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
                            @if ($quiz->details)
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Katılımcı Sayısı</div>                                
                                    </div>
                                    <span class="badge bg-warning rounded-pill">{{$quiz->details['join_count']}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">Ortalama Puan</div>
                                    </div>
                                    <span class="badge bg-info rounded-pill">{{$quiz->details['average']}}</span>
                                </li>
                            @endif                            
                        </ol>
                    </div>                    
                    <div class="col-md-8">
                        {{$quiz->description}}  
                        <br>

                        @if ($quiz->my_result)
                            <a href="{{route('quiz.join', $quiz->slug)}}" class="btn btn-info btn-block btn-sm" style="width: 100%">Quizi Görüntüle</a>
                        @else
                            <a href="{{route('quiz.join', $quiz->slug)}}" class="btn btn-primary btn-block btn-sm" style="width: 100%">Quize Katıl</a>
                        @endif

                    </div>                    
                </div>                
            </p>          
        </div>
      </div>

</x-app-layout>
