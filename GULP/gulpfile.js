//Exemplos de Códigos e Tarefas com vários plugins GULP

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    refresh = require('gulp-livereload'),
    server = require('tiny-lr')();


var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');


var cssnano = require('gulp-cssnano');

var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');

var del = require('del');

var runSequence = require('run-sequence');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

var notify = require('notify');
// notify() para mostrar uma mensagem assim que o nosso arquivo CSS for gerado:
//.pipe( notify( 'CSS OK!' ) );


gulp.task('compileStyles', function () {
    gulp.src('src/style.scss')
        .pipe(sass({
            noCache: true,
            precision: 4,
            unixNewlines: true
        }))
        .pipe(prefix('last 3 version'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server));
});

gulp.task('watch', function () {
    server.listen(35729, function (err) {
        if (err) { return console.log(err); }

        gulp.watch('src/**/*.{sass,scss}', [
            'compileStyles'
        ]);
    });
});

gulp.task('copy:pasta', function () {
    gulp.src('src/**/*')
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['copy:pasta']);

gulp.task('concat:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('default', ['compile:less', 'concat:js']);

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
});


gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});


gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});


//você pode criar GIFs entrelaçados

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imagemin({
            // Setting interlaced to true
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});





/* A otimização de imagens, no entanto, é um processo extremamente lento que
você não gostaria de repetir, a menos que necessário. Para fazer isso, 
podemos usar o plugin gulp-cache .*/

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});


//exclusão de arquivos
gulp.task('clean:dist', function () {
    return del.sync('dist');
})
//Agora o Gulp excluirá a pasta `dist` sempre que gulp clean:distfor executada.


// LIMPAR CACHE
// Para limpar os caches do sistema local, você pode criar uma tarefa separada chamada `cache: clear`
gulp.task('cache: clear', função(callback) {
    return cache.clearAll(callback)
})


// Run Sequence

gulp.task('task-name', function (callback) {
    runSequence('task-one', 'task-two', 'task-three', callback);
});

/*Quando task - name é chamado, o Gulp roda task-one primeiro.Quando task-one terminar,
 o Gulp iniciará automaticamente task-two.
 Finalmente, quando task-two estiver concluído, o Gulp executará task-three.
 */

/*A sequência de execução também permite executar tarefas simultaneamente,
 se você as colocar em uma matriz:*/

gulp.task('task-name', function (callback) {
    runSequence('task-one', ['tasks', 'two', 'run', 'in', 'parallel'], 'task-three', callback);
});

/*
Nesse caso, o Gulp executa pela primeira vez task-one.
 Quando task-one concluído, o Gulp executa todas as tarefas no segundo argumento simultaneamente.
 Todas as tarefas neste segundo argumento devem ser concluídas antes da task-three ser executada.
*/




//OUTROS EXEMPLOS
/*
A tarefa chamada watch inicia um servidor LiveReload escutando na 
porta 35729 (a porta padrão desse server) e colocando no console algum
acontecimento inesperado. Caso qualquer arquivo SASS seja alterado em
qualquer parte do diretório src, a tarefa compileStyles deve ser executada.
A página deverá ser recarregada, utilizando o LiveReload.

O arquivo gulpfile.js final deve se parecer com:
*/


var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    refresh = require('gulp-livereload'),
    server = require('tiny-lr')();

gulp.task('compileStyles', function () {
    gulp.src('src/style.scss')
        .pipe(sass({
            noCache: true,
            precision: 4,
            unixNewlines: true
        }))
        .pipe(prefix('last 3 version'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'))
        .pipe(refresh(server));
});

gulp.task('watch', function () {
    server.listen(35729, function (err) {
        if (err) { return console.log(err); }

        gulp.watch('src/**/*.{sass,scss}', [
            'compileStyles'
        ]);
    });
});



/**EXEMPLO MACRO COMENTADO COM ALGUNS PLUGINS */

// Definimos o diretorio dos arquivos para evitar repetição futuramente
var files = "./src/*.js";

//Aqui criamos uma nova tarefa através do ´gulp.task´ e damos a ela o nome 'lint'
gulp.task('lint', function () {

    // Aqui carregamos os arquivos que a gente quer rodar as tarefas com o `gulp.src`
    // E logo depois usamos o `pipe` para rodar a tarefa `jshint`
    gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//Criamos outra tarefa com o nome 'dist'
gulp.task('dist', function () {

    // Carregamos os arquivos novamente
    // E rodamos uma tarefa para concatenação
    // Renomeamos o arquivo que sera minificado e logo depois o minificamos com o `uglify`
    // E pra terminar usamos o `gulp.dest` para colocar os arquivos concatenados e minificados na pasta build/
    gulp.src(files)
        .pipe(concat('./dist'))
        .pipe(rename('dist.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no projeto
gulp.task('default', function () {

    // Usamos o `gulp.run` para rodar as tarefas
    // E usamos o `gulp.watch` para o Gulp esperar mudanças nos arquivos para rodar novamente
    gulp.run('lint', 'dist');
    gulp.watch(files, function (evt) {
        gulp.run('lint', 'dist');
    });
});