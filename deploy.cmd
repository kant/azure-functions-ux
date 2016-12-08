@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Version: 1.0.6
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
	SET DEPLOYMENT_SOURCE=%~dp0%.
	echo SET DEPLOYMENT_SOURCE
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED NEXT_CLIENT_MANIFEST_PATH (
  SET NEXT_CLIENT_MANIFEST_PATH=%ARTIFACTS%\client-manifest

  IF NOT EXIST "%NEXT_CLIENT_MANIFEST_PATH%" (MKDIR "%NEXT_CLIENT_MANIFEST_PATH%")

  IF NOT DEFINED PREVIOUS_CLIENT_MANIFEST_PATH (
    SET PREVIOUS_CLIENT_MANIFEST_PATH=%ARTIFACTS%\client-manifest
  )

  IF NOT EXIST "%PREVIOUS_CLIENT_MANIFEST_PATH%" (MKDIR "%PREVIOUS_CLIENT_MANIFEST_PATH%")
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)
IF NOT DEFINED DEPLOYMENT_TEMP (
  SET DEPLOYMENT_TEMP=%temp%\___deployTemp%random%
  SET CLEAN_LOCAL_DEPLOYMENT_TEMP=true
)

IF DEFINED CLEAN_LOCAL_DEPLOYMENT_TEMP (
  IF EXIST "%DEPLOYMENT_TEMP%" rd /s /q "%DEPLOYMENT_TEMP%"
  mkdir "%DEPLOYMENT_TEMP%"
)

IF DEFINED MSBUILD_PATH goto MsbuildPathDefined
SET MSBUILD_PATH=%ProgramFiles(x86)%\MSBuild\14.0\Bin\MSBuild.exe
:MsbuildPathDefined

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

echo Print variables
echo dp0=%~dp0%
echo ARTIFACTS=%ARTIFACTS%
echo DEPLOYMENT_SOURCE=%DEPLOYMENT_SOURCE%
echo DEPLOYMENT_TARGET=%DEPLOYMENT_TARGET%
echo DEPLOYMENT_TARGET_ANGULAR=%DEPLOYMENT_TARGET_ANGULAR%
echo NEXT_MANIFEST_PATH=%NEXT_MANIFEST_PATH%
echo PREVIOUS_MANIFEST_PATH=%PREVIOUS_MANIFEST_PATH%
echo DEPLOYMENT_TEMP=%DEPLOYMENT_TEMP%
echo IN_PLACE_DEPLOYMENT=%IN_PLACE_DEPLOYMENT%

echo Handling frontend Angular2 project.
:: 1. Bundle angular2 app to the temporary path
IF EXIST "%DEPLOYMENT_SOURCE%\AzureFunctions.AngularClient\package.json" (
  pushd "%DEPLOYMENT_SOURCE%\AzureFunctions.AngularClient"
  echo Restore npm packages
  call :ExecuteCmd npm install
  IF !ERRORLEVEL! NEQ 0 (
	call :ExecuteCmd npm install
	IF !ERRORLEVEL! NEQ 0 goto error
  )
  echo Bundle angular2 app to the temporary path
  call :ExecuteCmd ng build --output-path="%DEPLOYMENT_TEMP%"
  IF !ERRORLEVEL! NEQ 0 (
      call :ExecuteCmd ng build --output-path="%DEPLOYMENT_TEMP%"
      IF !ERRORLEVEL! NEQ 0 goto error
  )
)

echo Handling backend WebApi project.
echo Restore NuGet packages
IF /I "AzureFunctions.sln" NEQ "" (
  call :ExecuteCmd nuget restore "%DEPLOYMENT_SOURCE%\AzureFunctions.sln"
  IF !ERRORLEVEL! NEQ 0 goto error
)


:: 2. Build to the temporary path
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%MSBUILD_PATH%" "%DEPLOYMENT_SOURCE%\AzureFunctions\AzureFunctions.csproj" /nologo /verbosity:m /t:Build /t:pipelinePreDeployCopyAllFilesToOneFolder /p:_PackageTempDir="%DEPLOYMENT_TEMP%";AutoParameterizationWebConfigConnectionStrings=false;Configuration=Release;UseSharedCompilation=false /p:SolutionDir="%DEPLOYMENT_SOURCE%\.\\" %SCM_BUILD_ARGS%
) ELSE (
  call :ExecuteCmd "%MSBUILD_PATH%" "%DEPLOYMENT_SOURCE%\AzureFunctions\AzureFunctions.csproj" /nologo /verbosity:m /t:Build /p:AutoParameterizationWebConfigConnectionStrings=false;Configuration=Release;UseSharedCompilation=false /p:SolutionDir="%DEPLOYMENT_SOURCE%\.\\" %SCM_BUILD_ARGS%
)

IF !ERRORLEVEL! NEQ 0 goto error

:: 3. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_TEMP%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

:: 4. Copy templates-update webjob
SET WEBJOB_PATH=%HOME%\site\wwwroot\App_Data\jobs\triggered\templates-update
IF NOT EXIST "%WEBJOB_PATH%" (
  mkdir "%WEBJOB_PATH%"
)

IF EXIST %WEBJOB_PATH%\templates-update.cmd (
    del %WEBJOB_PATH%\templates-update.cmd
)

copy "%DEPLOYMENT_SOURCE%\WebJobs\templates-update\templates-update.ps1" "%WEBJOB_PATH%"
copy "%DEPLOYMENT_SOURCE%\WebJobs\templates-update\settings.job" "%WEBJOB_PATH%"

:: 5. update build.txt
call :ExecuteCmd echo %SCM_COMMIT_ID% > %DEPLOYMENT_TARGET%\build.txt
IF !ERRORLEVEL! NEQ 0 (
  call :ExecuteCmd echo %SCM_COMMIT_ID% > %DEPLOYMENT_TARGET%\build.txt
  IF !ERRORLEVEL! NEQ 0 goto error
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
