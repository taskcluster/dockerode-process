#!/bin/bash -ve
# USAGE: Run this file using `npm test` (must run from repository root)

mocha                             \
  test/utils_test.js              \
  test/docker_process_test.js     \
  ;
