set file=%1

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks %file% my-alias

set Path=%Path%;%ANDROID_HOME%\build-tools\27.0.3

set outvar=ForTaper.apk

zipalign.exe -v 4 %file% %outvar%

apksigner verify %outvar%

del /Q /F %file%
