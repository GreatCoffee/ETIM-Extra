# ETIM-Extra

Add-on of **Easy Times In Minecraft (etim)** for Minecraft 1.12.2 / Forge — the
mithril and adamantium shields.

- modid: `etimextra`
- package: `io.github.etim.etimextra`
- dependency: `etim-1.0.0` (runtime `required-after:etim`)
- toolchain: Forge 14.23.5.2860 + RetroFuturaGradle 2.0.3 (+ MixinBooter when
  the first mixin lands; `use_mixins` is off until then)

## Division of labour with the main mod

The main mod owns the shield **mechanism** (AD-10+SH): the 1.12 full-free shield
segment is closed (`MixinEntityLivingBaseBlock`), and every `Item#isShield`
carrier takes `(int)(blocked × shieldWearRate)` wear through
`combat/ETIMBlocking`. This mod owns the shield **items** only and never
re-derives the halving, the floor or the wear.

R196 has no shield item — the whole shield face is a post-R196 extension
(D-3 无源待裁). Values are adjudicated from the R196 material rows and the 1.12
shield base, then recorded in `playground/audit/audit-extra-裁定回执.md`.

## Build

`JAVA_HOME` must point at the JDK 25 used by the Gradle launcher (the default
JDK 21 breaks the RetroFutura/CurseForge plugins); the Minecraft runtime itself
stays on the Java 8 toolchain managed by Gradle.

The `etim-1.0.0` artifact comes from `mavenLocal`:

```powershell
# once per main-mod change: publish the dev jar under the `dev` classifier
cd "D:\OpenCodeWorkspace\Easy Times In Minecraft\git-workspace\etim"
$env:JAVA_HOME = 'C:\Users\GreatCoffee\tools\jdk-25.0.4.1+1'
.\gradlew.bat publishToMavenLocal

cd "D:\OpenCodeWorkspace\ETIM-Extra"
.\gradlew.bat build
```

The dependency is `io.github.etim:etim:1.0.0:dev` — the MCP-named dev jar. The
main artifact is the reobf/SRG jar and must not be used in a dev workspace.
Keep the jar on the classpath only: a copy in `run/mods` duplicates the mod
(MixinBooter rescues mods jars into the classloader and FML rescans the folder).

Long build/run logs go to `testharness/build-logs/` (git-ignored) — never into
the conversation.

## Dev server round

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File testharness\server\run-server.ps1 -StopAfterSeconds 35 -Tag smoke
```

Boots `runServer`, types `stop` into the server console after N seconds (stock
1.12.2 RCON cannot carry auth+exec on one connection — B-EXTRA-2), and snapshots
`run/logs/latest.log` to `testharness/build-logs/<Tag>-latest.log`.


## Configuration and judgement channel

`config/etimextra.cfg` (Forge Configuration) holds every player-perceivable
value; today only the dev switch `debug.extraDebugLog`, loaded once in
`preInit`. The two load rows `[ExtraLog] preInit` / `[ExtraLog] boot ok - ...`
are ungated on purpose — they are the smoke round's assertion.

## Layout

| Path | Contents |
|---|---|
| `src/main/java` | mod entry (`ETIMExtra`), shield content |
| `playground/audit` | append-only adjudication ledger + judgement chain |
| `testharness` | server/RCON/bot test rig (run by 会话七) |
