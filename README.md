## About
This repository is basically a fork of the [Official Typescript Template](https://github.com/bitburner-official/typescript-template) that uses the Typescript compiler and the Remote File API system to synchronize Typescript to your game.

I also took the liberty to implement dockerized environment using [Mutagen](https://mutagen.io) for Linux and Mac users.

If you are a Windows user or you don't want to run in docker, please refer to this [setup guide](https://github.com/bitburner-official/typescript-template).

## Prerequisites
[Mutagen](https://mutagen.io) is needed for syncing files between the container and your local machine.

You can install it using [homebrew](https://brew.sh)

```
    brew install mutagen-io/mutagen/mutagen
```



## Quick start

```
    git clone https://github.com/grabas/bitburner
    cd bitburner
    mutagen-compose up -d --build
```

You can monitor the logs using the following command:

```
    mutagen-compose logs -f bitburner-sync
```

#### Then in game, go to Options -> Remote API -> type in the port: `12525` -> click connect. The icon should turn green and say it's online.

## Aliases
You can use the following aliases to make your life easier:

Execute in the game console

```
    alias cc="clear";
    alias init="run /init.js";
    alias play="run /play.js";
    alias access="run /src/command/gain-access.js";
    alias get-server="run /src/repository/server-repository.js";
    alias path="run /src/utils/crawler.js";
    alias solve="run /src/command/solve-contracts.js";
    alias monitor="run /src/utils/monitor.js";
    alias attack="run /src/command/batch-attack.js";
    alias batch-analyze="run /src/component/batch/analyze.js";
    alias dw="connect darkweb; buy -a; home";
    alias prep="run /src/command/prepare-target.js";
```