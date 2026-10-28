<#
  run-server.ps1 — dev server boot + graceful stop (ETIM-Extra harness)

  One call = one boot round:
    1. seeds run/server.properties + run/eula.txt from the templates (if absent);
    2. starts `gradlew runServer` with stdin wired so that `stop` is typed into
       the server console after -StopAfterSeconds;
    3. tees the Gradle output into testharness/build-logs/<Tag>.out;
    4. snapshots run/logs/latest.log to testharness/build-logs/<Tag>-latest.log.

  Why stdin instead of RCON: stock 1.12.2 RConThreadClient closes the socket in
  the `finally` of every loop iteration, so one connection can carry exactly one
  packet — auth and exec can never ride together (B-EXTRA-2, 2026-10-28). The
  console `stop` is the only graceful path until the harness carries the
  RConThreadClient binpatch the main project uses.

  Success markers in <Tag>-latest.log: `[ExtraLog] boot ok`, `Done (`,
  `Stopping the server`, `Saving worlds`; the Gradle line must read
  BUILD SUCCESSFUL.
#>
param(
    [int]$StopAfterSeconds = 40,
    [string]$Tag = "smoke"
)

# `cmd` writes Gradle's JVM warnings to stderr; with Stop those become fatal
# error records, so this script stays on Continue and checks the result itself.
$ErrorActionPreference = "Continue"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$runDir = Join-Path $root "run"
$logDir = Join-Path $root "testharness\build-logs"
$env:JAVA_HOME = "C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1"

New-Item -ItemType Directory -Force -Path $runDir, $logDir | Out-Null
if (-not (Test-Path (Join-Path $runDir "server.properties"))) {
    Copy-Item (Join-Path $PSScriptRoot "server.properties") (Join-Path $runDir "server.properties")
}
if (-not (Test-Path (Join-Path $runDir "eula.txt"))) {
    "eula=true" | Set-Content -Path (Join-Path $runDir "eula.txt") -Encoding ascii
}

$out = Join-Path $logDir ("$Tag.out")
Push-Location $root
try {
    # ping is the sleep: `timeout` refuses redirected stdin inside a pipe.
    cmd /c "(ping -n $($StopAfterSeconds + 1) 127.0.0.1 >nul & echo stop) | gradlew.bat runServer --console=plain" 2>&1 |
        Tee-Object -FilePath $out
} finally {
    Pop-Location
}

$latest = Join-Path $runDir "logs\latest.log"
if (Test-Path $latest) {
    $snap = Join-Path $logDir ("$Tag-latest.log")
    Copy-Item $latest $snap -Force
    Write-Output ("snapshot: " + $snap + " (" + (Get-Item $snap).Length + " B)")
}
