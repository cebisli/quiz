<x-app-layout>
    <x-slot name="header"> <b>{{$quiz->title}}</b> için yeni soru oluştur</x-slot>    
    
    <div class="card">
        <div class="card-body">
            
            <form action="{{route('questions.store', $quiz->id)}}" method="post" enctype="multipart/form-data">
                @csrf
                <div class="form-group">
                    <label>Soru</label>
                    <textarea name="question" class="form-control" rows="4">{{ old('question') }}</textarea>
                </div>
                <br>
                <div class="form-group">
                    <label>Fotoğraf</label>
                    <input type="file" name="image" class="form-control">
                </div>
                <br>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Cevap 1</label>
                            <textarea name="answer1" class="form-control" cols="30" rows="4">{{ old('answer1') }}</textarea>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Cevap 2</label>
                            <textarea name="answer2" class="form-control" cols="30" rows="4">{{ old('answer2') }}</textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Cevap 3</label>
                            <textarea name="answer3" class="form-control" cols="30" rows="4">{{ old('answer3') }}</textarea>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Cevap 4</label>
                            <textarea name="answer4" class="form-control" cols="30" rows="4">{{ old('answer4') }}</textarea>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Doğru Cevap</label>
                    <select name="correct_answer" class="form-control">
                        @for ($i = 1; $i < 5; $i++)
                            <option value="answer{{$i}}" @if (old('correct_answer') == "answer".$i) selected @endif> {{$i}}. Cevap</option>
                        @endfor                        
                    </select>
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