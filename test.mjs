import chai from 'chai';
import execa from 'execa';

import {
  handleAbsolute,
  extractArgs
} from './index';
import path from 'path';

const { expect } = chai;

describe('handleAbsolute', function() {
  let root = '@@ROOT_SENTINAL@@';

  it('works', function() {
    expect(handleAbsolute('/foo/bar/baz', root)).to.eql('/foo/bar/baz');
    expect(handleAbsolute('foo/bar/baz', root)).to.eql('@@ROOT_SENTINAL@@/foo/bar/baz');
  });
});

describe('extractArgs', function() {
  it('works', function() {
    expect(extractArgs(['/foo/bar/bin/node', 'this-file', 'a1', 'a2', '...', 'an'])).to.eql({
      args: ['a1', 'a2', '...', 'an'],
      bin: '/foo/bar/bin/node',
      current: 'this-file'
    })
  });
});

describe('mocha-esm', function() {
  it('works', async function() {
    let child = await execa('./bin/mocha-esm', ['fixtures/a', 'fixtures/b']);

    expect(child.code).to.eql(0);
    expect(child.stdout).to.contain('foo A');
    expect(child.stdout).to.contain('works A');

    expect(child.stdout).to.contain('foo B');
    expect(child.stdout).to.contain('works B');
  });

 it('fails', async function() {
   try {
     await execa('./bin/mocha-esm', ['fixtures/fail']);
     // should not get here
     expect(true).to.eq(false);
   } catch (e) {
     expect(e.message).to.contain('I WILL FAIL')
   }
  });
});
