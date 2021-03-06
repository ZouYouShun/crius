import {
  autorun,
  title,
  examples,
  beforeEach,
  afterEach,
  plugins,
} from '../src/decorators';
import { Step } from '../src/step';

test('test @autorun', () => {
  const _test = (title: string, callback: (...args: any[]) => void) => callback();
  const Bar = autorun(_test)(class extends Step {});
});

test('test @title', () => {
  @title('bar title')
  class Bar extends Step {}

  expect(Bar.title).toEqual('bar title');
  for (const item of [null, undefined]) {
    try {
      @title(item as any)
      class Bar extends Step {}
    } catch(e) {
      expect(e.toString()).toEqual('Error: Test case title is required.');
    }
  }
});

test('test @examples', () => {
  class Bar extends Step {
    @examples`
      | accountTag   | contactType | smsMessage |
      | us           | personal    | aaa        |
    `
    run() {}
  }
  
  expect(Bar.params).toEqual([{
    accountTag: 'us',
    contactType: 'personal',
    smsMessage: 'aaa'
  }]);

  class Foo extends Step {
    @examples(`
    | accountTag   | contactType | smsMessage |
    | us           | personal    | aaa        |
  `)
    run() {}
  }
  
  expect(Foo.params).toEqual([{
    accountTag: 'us',
    contactType: 'personal',
    smsMessage: 'aaa'
  }]);

  class FooBar extends Step {
    @examples([{
      accountTag: 'us',
      contactType: 'personal',
      smsMessage: 'aaa'
    }])
    run() {}
  }
  
  expect(FooBar.params).toEqual([{
    accountTag: 'us',
    contactType: 'personal',
    smsMessage: 'aaa'
  }]);

  for (const item of [
    undefined,
    null,
    1,
    true,
    [null],
    [undefined],
    [1],
    [true]
  ]) {
    try {
      class FooBar extends Step {
        @examples(item as any)
        run() {}
      }
    } catch(e) {
      expect(e.toString()).toEqual('Error: "@example" argument error, it must be an object or a string.');
    }
  }
});

test('test @beforeEach', () => {
  const callback = (props: any, context: any, step: any) => {};
  @beforeEach(callback)
  class FooBar<P = {}, C = {}> extends Step<P, C> {}
  
  expect(FooBar.beforeEach).toEqual(callback);

  for (const item of [
    undefined,
    null,
    1,
    true,
    '1',
    {},
    [],
  ]) {
    try {
      @beforeEach(item as any)
      class FooBar<P = {}, C = {}> extends Step<P, C> {}
    } catch(e) {
      expect(e.toString()).toEqual('Error: "@beforeEach" argument error, it must be a function.');
    }
  }
});

test('test @afterEach', () => {
  const callback = (props: any, context: any, step: any) => {};
  @afterEach(callback)
  class FooBar<P = {}, C = {}> extends Step<P, C> {}
  
  expect(FooBar.afterEach).toEqual(callback);

  for (const item of [
    undefined,
    null,
    1,
    true,
    '1',
    {},
    [],
  ]) {
    try {
      @afterEach(item as any)
      class FooBar<P = {}, C = {}> extends Step<P, C> {}
    } catch(e) {
      expect(e.toString()).toEqual('Error: "@afterEach" argument error, it must be a function.');
    }
  }
});

test('test @plugins', () => {
  const callback = (props: any, context: any, step: any) => {};
  @plugins([{
    beforeEach: callback,
    afterEach: callback,
  }])
  class FooBar<P = {}, C = {}> extends Step<P, C> {}
  
  expect(FooBar.plugins![0].beforeEach).toEqual(callback);
  expect(FooBar.plugins![0].afterEach).toEqual(callback);
});
