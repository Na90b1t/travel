const gulp = require("gulp"), // Подключаем Gulp (сборщик файлов)
    sass = require("gulp-sass"), // Подключаем Sass пакет для перевода scss в css
    autoprefixer = require("gulp-autoprefixer"), // Подключаем autoprefixer для  поддержки стилей
    browserSync = require("browser-sync"), // Подключаем browser-sync
    // concat = require("gulp-concat"), // Подключаем библиотеку для конкатенации файлов
    uglify = require("gulp-uglifyjs"), // Подключаем библиотеку для сжатия JS
    babel = require("gulp-babel"), // Подключаем babel для поддержки JS
    cssnano = require("gulp-cssnano"), // Подключаем пакет для минификации CSS
    rename = require("gulp-rename"), // Подключаем библиотеку для переименования файлов
    flatten = require("gulp-flatten"), // Подключаем библиотеку обьединения подпапок в папку
    csscomb = require("gulp-csscomb"), // Подключаем csscomb
    pug = require("gulp-pug"), // Подключаем pug (html шаблонизатор)
    htmlbeautify = require("gulp-html-beautify"), // Подключаем html-beautify для выравнивания после Pug
    plumber = require("gulp-plumber"), // Подключаем plumber для безпрерывной работы сборки при ошибке
    notify = require("gulp-notify"), // Подключаем notify для уведомления об ошибках
    del = require("del"); // Подключаем библиотеку для удаления файлов и папок

//  GULP PRE-BUILD / START
gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./dev"
        },
        notify: false
    });
});

gulp.task("clean", function() {
    return del.sync("dev");
});

gulp.task("pug", function() {
    var optionsHtmlBeautify = {
        indentSize: 2,
        unformatted: ["a", "img", "span"]
    };
    return gulp
        .src("app/*.pug")
        .pipe(
            plumber({
                errorHandler: notify.onError()
            })
        )
        .pipe(pug())
        .pipe(htmlbeautify(optionsHtmlBeautify))
        .pipe(gulp.dest("dev"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("fonts", function() {
    return gulp
        .src("app/fonts/**/*")
        .pipe(flatten())
        .pipe(gulp.dest("dev/fonts"));
});

gulp.task("img", function() {
    return gulp.src("app/img/**/*").pipe(gulp.dest("dev/img"));
});

// gulp.task("css-libs", function() {
//     return gulp
//         .src([
//             "node_modules/slick-carousel/slick/slick.css",
//             "node_modules/magnific-popup/dist/magnific-popup.css"
//         ])
//         .pipe(concat("libs.css"))
//         .pipe(cssnano())
//         .pipe(rename({ suffix: ".min" }))
//         .pipe(gulp.dest("dev/css"));
// });

gulp.task("sass", function() {
    return gulp
        .src("app/scss/**/*.scss")
        .pipe(
            plumber({
                errorHandler: notify.onError()
            })
        )
        .pipe(sass())
        .pipe(
            autoprefixer(
                [
                    "last 2 versions",
                    "ie 11",
                    "Android >= 4.1",
                    "Safari >= 8",
                    "iOS >= 8"
                ],
                { cascade: true }
            )
        )
        .pipe(csscomb())
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.reload({ stream: true }));
});

// gulp.task("js-libs", function() {
//     return gulp
//         .src([
//             "node_modules/jquery/dist/jquery.min.js",
//             "node_modules/slick-carousel/slick/slick.min.js",
//             "node_modules/magnific-popup/dist/jquery.magnific-popup.min.js"
//         ])
//         .pipe(concat("libs.min.js"))
//         .pipe(gulp.dest("dev/js"));
// });

gulp.task("js-scripts", function() {
    return gulp
        .src(["app/js/*.js"])
        .pipe(gulp.dest("dev/js"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", function() {
    gulp.watch("app/**/*.pug", gulp.parallel("pug"));
    gulp.watch("app/scss/**/*.scss", gulp.parallel("sass"));
    gulp.watch("app/js/*.js", gulp.parallel("js-scripts"));
    // gulp.watch("app/img/**/*.svg", gulp.parallel("img")); // Наблюдение за SVG файлами // no work
});

gulp.task(
    "dev",
    gulp.parallel(
        "clean",
        "browser-sync",
        "pug",
        "fonts",
        "img",
        // "css-libs",
        "sass",
        // "js-libs",
        // "js-scripts",
        "watch"
    )
);
//  GULP PRE-BUILD / END

//  GULP BUILD / START
gulp.task("clean-build", function() {
    return del.sync("dist");
});

gulp.task("browser-sync-build", function() {
    browserSync({
        server: {
            baseDir: "./dist"
        },
        notify: false
    });
});

gulp.task("html-build", function() {
    return gulp.src("dev/*.html").pipe(gulp.dest("dist"));
});

gulp.task("fonts-build", function() {
    return gulp.src("dev/fonts/*").pipe(gulp.dest("dist/fonts"));
});

// gulp.task("css-libs-build", function() {
//     return gulp.src("dev/css/*.min.css").pipe(gulp.dest("dist/css"));
// });

gulp.task("css-build", function() {
    return gulp
        .src("dev/css/main.css")
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/css"));
});

// gulp.task("js-libs-build", function() {
//     return gulp.src(["dev/js/*.min.js"]).pipe(gulp.dest("dist/js"));
// });

gulp.task("js-build", function() {
    return gulp
        .src(["dev/js/common.js"])
        .pipe(
            babel({
                presets: ["@babel/env"]
            })
        )
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("img-build", function() {
    return gulp.src("dev/img/**/*").pipe(gulp.dest("dist/img"));
});

gulp.task(
    "build",
    gulp.parallel(
        "clean-build",
        "browser-sync-build",
        "html-build",
        "fonts-build",
        "img-build",
        // "css-libs-build",
        "css-build",
        // "js-libs-build",
        "js-build"
    )
);
//  GULP BUILD / END
