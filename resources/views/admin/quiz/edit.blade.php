<x-app-layout>
    <x-slot name="header">Quiz Oluştur</x-slot>    
    
    <div class="card">
        <div class="card-body">
            
            <form action="{{route('quizzes.update', $quiz->id)}}" method="post">
                @method('PUT')
                @csrf
                <div class="form-group">
                    <label>Quiz Başlığı</label>
                    <input type="text" name="title" class="form-control" value=" {{$quiz->title}}">
                </div>
                <div class="form-group">
                    <label>Quiz Başlığı</label>
                    <textarea name="description" class="form-control" cols="30" rows="4">{{ $quiz->description }}</textarea>
                </div>
                <br>
                <div class="form-group">
                    <label>Quiz Durumu</label>                    
                    <select name="status" id="" class="form-control">
                        <option 
                            @if ($quiz->status == 'publish') selected @endif 
                            @if ($quiz->questions_count < 4) disabled @endif
                            value="publish">
                            Aktif
                        </option>
                        <option @if ($quiz->status == 'passive') selected @endif value="passive">Pasif</option>
                        <option @if ($quiz->status == 'draft') selected @endif value="draft">Taslak</option>
                    </select>                    
                </div>
                <br>
                <div class="form-group">
                    <input type="checkbox" @if ($quiz->finished_at) checked @endif class="form-control" id="bitisTarihiBelirt">
                    <label for="bitisTarihiBelirt">Bitiş Tarihi Belirt</label>                    
                </div>
                <br>
                <div id="finished_input" class="form-group" @if (!$quiz->finished_at) style="display: none;" @endif>
                    <label>Bitiş Tarihi</label>
                    <input type="datetime-local" name="finished_at" class="form-control" value="{{ $quiz->finished_at }}">
                </div>
                <br>
                <div class="form-group" style="text-align: right;">
                    <button type="submit" class="btn btn-outline-success btn-sm">Quiz Güncelle</button>
                </div>
            </form>
            
        </div>

        <x-slot name="js">
            <script>
                $('#bitisTarihiBelirt').change(function() {
                    if ($(this).is(':checked'))
                        $('#finished_input').show();
                    else
                        $('#finished_input').hide();    
                });
            </script>
        </x-slot>
    </div>
</x-app-layout>    