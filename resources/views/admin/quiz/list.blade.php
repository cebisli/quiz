<x-app-layout>
    <x-slot name="header">Quizler</x-slot>
    
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">
                <a href="{{ route('quizzes.create') }}" class="btn btn-sm btn-primary">
                    <i class="fa fa-plus"></i> Quiz Oluştur</a>
            </h5>

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
                                        <span class="badge bg-success">Aktif</span>
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
                                <a href=" {{route('questions.index', $quiz->id)}} " class="btn btn-sm btn-warning">
                                    <i class="fa fa-question"></i></a>
                                <a href=" {{route('quizzes.edit', $quiz->id)}} " class="btn btn-sm btn-primary"><i class="fa fa-pen"></i></a>
                                <a href=" {{route('quizzes.destroy', $quiz->id)}} " class="btn btn-sm btn-danger"><i class="fa fa-times"></i></a>    
                            </td>
                        </tr>    
                    @endforeach                                
                </tbody>
              </table>       
              {{ $quizes->links() }}       
        </div>
    </div>
    
</x-app-layout>
