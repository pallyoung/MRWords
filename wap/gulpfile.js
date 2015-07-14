var gulp = require("gulp");
var destSrc = "../android_client/assets/app";
var src;
gulp.task("build",["copyjs","copycss","copyhtml"],function  () {

});

gulp.task("copyjs",function () {
	gulp.src(["js/**"])
	.pipe(gulp.dest(destSrc+"/js"));
})
gulp.task("copycss",function () {
	gulp.src(["css/**"])
	.pipe(gulp.dest(destSrc+"/css"));
})
gulp.task("copyhtml",function () {
	gulp.src(["*.html"])
	.pipe(gulp.dest(destSrc));
})