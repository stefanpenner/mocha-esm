# mocha-esm

[![Build Status](https://travis-ci.org/stefanpenner/mocha-esm.svg?branch=master)](https://travis-ci.org/stefanpenner/mocha-esm)
So I was playing around with esm (`.mjs`) files and realized, I couldn't get
mocha running nicely. So this happened.

This is likely missing features, but I am open to PR's addressing!

## Installation

```sh
yarn add global mocha-esm
```

or

```sh
npm i -g mocha-esm
```

Then:

```
mocha-esm <path/to/test> <path/to/other/test>
mocha-esm inspect <path/to/test> <path/to/other/test>
mocha-esm inspect-brk <path/to/test> <path/to/other/test>
```
