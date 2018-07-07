import chai from 'chai';
import execa from 'execa';

import {
  handleAbsolute,
  normalizeOptionAliases
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

describe('normalizeOptionAliases', function() {
  it('works', function() {
    expect(normalizeOptionAliases({})).to.eql({});
    expect(normalizeOptionAliases({})).to.not.equal({});
    expect(normalizeOptionAliases({ g: 'foo'})).to.not.equal({ grep: 'foo'});
    expect(normalizeOptionAliases({ i: 'foo'})).to.not.equal({ invert: 'foo'});
    expect(normalizeOptionAliases({ i: 'foo', apple: [{ a:1 }]})).to.not.equal({ invert: 'foo', apple: [{ a: 1}]});
    expect(normalizeOptionAliases({ _: ['a'] })).to.not.equal({ });
  });
});

describe('runner', function() {
  // TODO: if problems arise, lets add tests here
});

describe('acceptance', function() {
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

  it('greps', async function() {
    let child = await execa('./bin/mocha-esm', ['--grep', 'works A', 'fixtures/a']);
    expect(child.stdout).to.contain('works A');
    expect(child.stdout).to.not.contain('works B');
  });

  it('greps invert', async function() {
    let child = await execa('./bin/mocha-esm', ['-i', '--grep', 'works A', 'fixtures/a']);
    expect(child.stdout).to.not.contain('works A');
    expect(child.stdout).to.contain('works B');
  });
});
