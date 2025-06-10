'use strict';

const contractHandler = require('..');
const assert = require('assert').strict;

assert.strictEqual(contractHandler(), 'Hello from contractHandler');
console.info('contractHandler tests passed');
