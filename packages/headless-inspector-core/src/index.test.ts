jest.mock('./interceptors');
import HeadlessInspector from './index';
import { interceptConsole, interceptNetwork } from './interceptors';
const mockedInterceptConsole = jest.mocked(interceptConsole);
const mockedInterceptNetwork = jest.mocked(interceptNetwork);

describe('enable', () => {
  beforeEach(() => {
    mockedInterceptConsole.mockClear();
    mockedInterceptNetwork.mockClear();
  });

  it('should call interceptores when enable() is called', () => {
    const inspector = new HeadlessInspector();
    inspector.enable();
    expect(mockedInterceptConsole).toBeCalledTimes(1);
    expect(mockedInterceptNetwork).toBeCalledTimes(1);
  });
  it('should call interceptores once event if enable() is called at multple times', () => {
    const inspector = new HeadlessInspector();
    inspector.enable();
    inspector.enable();
    inspector.enable();
    expect(mockedInterceptConsole).toBeCalledTimes(1);
    expect(mockedInterceptNetwork).toBeCalledTimes(1);
  });
});

// describe('send', () => {
//   it.todo('', () => {
//     const inspector = new HeadlessInspector();
//   });
// });
