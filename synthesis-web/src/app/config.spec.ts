import { Config } from './config';

describe('Config', () => {
  beforeEach(() => {

  });

  it('should be created', () => {
    expect(new Config()).toBeTruthy();
  });

  it('default models ulr', () => {
    const c = new Config();
    c.init('server', '');
    expect(c.modelsURL).toEqual('server/synthesis.data/models.json');
  });

  it('default models ulr from undefined', () => {
    const c = new Config();
    c.init('server', undefined);
    expect(c.modelsURL).toEqual('server/synthesis.data/models.json');
  });

  it('default models ulr from null', () => {
    const c = new Config();
    c.init('server', null);
    expect(c.modelsURL).toEqual('server/synthesis.data/models.json');
  });

  it('sets models ulr', () => {
    const c = new Config();
    c.init('server', '/models.json');
    expect(c.modelsURL).toEqual('server/models.json');
  });

});
