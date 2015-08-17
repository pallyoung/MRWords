cd ../android_client
aapt package -f -m -J gen -S res -I "D:/develop tools/adt-bundle-windows-x86_64-20130917/sdk/platforms/android-L/android.jar" -M AndroidManifest.xml

pause

mkdir bin
 
javac -target 1.8 -bootclasspath "D:/develop tools/adt-bundle-windows-x86_64-20130917/sdk/platforms/android-L/android.jar" -d bin gen/cn/com/fan6
 
/mrwords/*.java

pause
