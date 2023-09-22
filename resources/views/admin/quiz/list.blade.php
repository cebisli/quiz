<x-app-layout>
    <x-slot name="header">Quizler</x-slot>
    
    <div class="card">
        <div class="card-body">    
            
            <h5 class="card-title float-end">
                <a href="{{ route('quizzes.create') }}" class="btn btn-sm btn-primary">
                    <i class="fa fa-plus"></i> Quiz Oluştur</a>
            </h5>
            
            <form method="GET" action="">
                <div class="row">
                    <div class="col-md-3">
                        <input type="tet" name="title" value="{{request()->get('title')}}" placeholder="Quiz Adı" class="form-control">
                    </div>
                    <div class="col-md-3">
                        <select name="status" class="form-control" onchange="this.form.submit()">
                            <option value="">Seçiniz</option>
                            <option value="publish" @if (request()->get('status') == 'publish') selected @endif >Aktif</option>
                            <option value="passive" @if (request()->get('status') == 'passive') selected @endif >Pasif</option>
                            <option value="draft" @if (request()->get('status') == 'draft') selected @endif >Taslak</option>
                        </select>
                    </div>
                    @if (request()->get('status') || request()->get('title'))
                        <div class="col-md-2">
                            <a href="{{route('quizzes.index')}}" class="btn btn-secondary">Sıfırla</a>
                        </div>    
                    @endif                    
                </div>        
            </form>            

            <table class="table table-bordered">
                <colgroup>
                    <col width='50%'>
                    <col width='10%'>
                    <col width='10%'>
                    <col width='10%'>
                    <col width='20%'>
                </colgroup>
                <thead>
                  <tr>
                    <td scope="col">Quiz</td>
                    <td scope="col">Soru Sayısı</td>
                    <td scope="col">Durum</td>
                    <td scope="col">Bitiş Tarihi</td>
                    <td scope="col">İşlemler</td>
                  </tr>
                </thead>
                <tbody>
                    @foreach ($quizes as $quiz)
                        <tr>
                            <td> {{ $quiz->title }} </td>
                            <td> {{ $quiz->questions_count }} </td>
                            <td> 
                                @switch($quiz->status)
                                    @case('publish')
                                        @if (!$quiz->finished_at)
                                            <span class="badge bg-success">Aktif</span>
                                        @elseif ($quiz->finished_at > now())
                                            <span class="badge bg-success">Aktif</span>    
                                        @else
                                        <span class="badge bg-secondary text-white">Tarihi Geçmiş</span>
                                        @endif
                                        
                                        @break
                                    @case('passive')
                                        <span class="badge bg-danger">Pasif</span>   
                                        @break
                                    @case('draft')
                                        <span class="badge bg-warning">Taslak</span>   
                                        @break
                                @endswitch    
                            </td>
                            <td> 
                                <span title="{{$quiz->finished_at}}">
                                    {{ $quiz->finished_at ? $quiz->finished_at->diffForHumans() : '-' }} 
                                </span>
                            </td>
                            <td>
                                <a href=" {{route('quizzes.detail', $quiz->id)}} " class="btn btn-sm btn-info">
                                    <i class="fa fa-info-circle"></i></a> 
                                <a href=" {{route('questions.index', $quiz->id)}} " class="btn btn-sm btn-warning">
                                    <i class="fa fa-question"></i></a>
                                <a href=" {{route('quizzes.edit', $quiz->id)}} " class="btn btn-sm btn-primary"><i class="fa fa-pen"></i></a>
                                <a href=" {{route('quizzes.destroy', $quiz->id)}} " class="btn btn-sm btn-danger"><i class="fa fa-times"></i></a>    
                            </td>
                        </tr>    
                    @endforeach                                
                </tbody>
              </table>       
              {{ $quizes->withQueryString()->links() }}       
        </div>
    </div>
    
</x-app-layout>
