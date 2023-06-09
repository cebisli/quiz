<x-app-layout>
    <x-slot name="header">Quiz Oluştur</x-slot>    
    
    <div class="card">
        <div class="card-body">
            
            <form action="{{route('quizzes.store')}}" method="post">
                @csrf
                <div class="form-group">
                    <label>Quiz Başlığı</label>
                    <input type="text" name="title" class="form-control" value=" {{ old('title') }}">
                </div>
                <div class="form-group">
                    <label>Quiz Başlığı</label>
                    <textarea name="description" class="form-control" cols="30" rows="4">{{ old('description') }}</textarea>
                </div>
                <br>
                <div class="form-group">
                    <input type="checkbox" @if (old('finished_at')) checked @endif class="form-control" id="bitisTarihiBelirt">
                    <label for="bitisTarihiBelirt">Bitiş Tarihi Belirt</label>                    
                </div>
                <br>
                <div id="finished_input" class="form-group" @if (!old('finished_at')) style="display: none;" @endif>
                    <label>Bitiş Tarihi</label>
                    <input type="datetime-local" name="finished_at" class="form-control" value="{{ old('finished_at') }}">
                </div>
                <br>
                <div class="form-group" style="text-align: right;">
                    <button type="submit" class="btn btn-outline-success btn-sm">Quiz Oluştur</button>
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