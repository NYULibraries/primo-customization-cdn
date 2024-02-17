const { modifyCSPHeader, setPathAndQueryVid, updateGoldenFiles } = require('../e2e/testutils');

describe('modifyCSPHeader', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it( 'should do nothing if a "Content-Security-Policy" header is not present', async () => {
    const headersWithoutCsp = {
      'Cache-Control'     : 'max-age=0',
      'Connection'        : 'keep-alive',
      'Content-Encoding'  : 'gzip',
      'Content-Type'      : 'text/html',
      'Keep-Alive'        : 'timeout=20',
      'Transfer-Encoding' : 'chunked',
      'Vary'              : 'accept-encoding',
    };

    // Stub Playwright `page` and `route`.
    const route = {
      continue : jest.fn(),
      fetch   : jest.fn().mockResolvedValue( {
                                               headers : () => headersWithoutCsp,
                                             } ),
      fulfill : jest.fn(),
    };
    const page = {
      route : jest.fn().mockImplementation( ( _, handler ) => handler( route ) )
    };

    await modifyCSPHeader( page );

     // Verify that the continue method was called
    expect(route.continue).toHaveBeenCalled();
     expect(route.fulfill).not.toHaveBeenCalled();
  } );

  it('should remove case-sensitive upgrade-insecure-requests from CSP header', async () => {
    // Mock response headers
    const headersWithDirective = {
      'content-security-policy': 'default-src self; Upgrade-insecure-requests'
    };

    // Mock route.fetch() to return headers with directive
    const route = {
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithDirective,
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    // Capture the headers passed to route.fulfill
    const modifiedHeaders = route.fulfill.mock.calls[0][0].headers;

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(modifiedHeaders['content-security-policy']).toBeDefined();
    expect(modifiedHeaders['content-security-policy'].toLowerCase()).not.toContain('upgrade-insecure-requests');
    expect(modifiedHeaders).toBeDefined();
    expect(page.route).toHaveBeenCalled();
    expect(page.route).toHaveBeenCalledTimes(1);
    expect(route.fetch).toHaveBeenCalled();
    expect(route.fetch).toHaveBeenCalledTimes(1);
    expect(route.fulfill).toHaveBeenCalledWith({
      response: expect.anything(),
      headers: {
        'content-security-policy': 'default-src self'
      }
    });
    expect(route.fulfill).toHaveBeenCalledTimes(1);
  });

  it('should not include content-security-policy in csp if header is undefined', async () => {
    // Mock response headers with CSP header set to undefined
    const headersWithCSPUndefined = {
      'content-security-policy': undefined,
    };

    // Mock route.fetch() to return headers with CSP header set to undefined
    const route = {
      continue: jest.fn(),
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithCSPUndefined
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    // Assertions
    expect(page).toBeDefined();
    expect(page).toBeTruthy();
    expect(route.fetch).toHaveBeenCalled();
    expect(route.continue).toHaveBeenCalled();
    expect(route.fulfill).not.toHaveBeenCalled();
  });

  it('should not alter CSP header if upgrade-insecure-requests is not present', async () => {
    // Mock response headers without the directive
    const headersWithoutDirective = {
      'content-security-policy': 'default-src self'
    };

    // Mock route.fetch() to return headers without the directive
    const route = {
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithoutDirective
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    const modifiedHeaders = route.fulfill.mock.calls[0][0].headers;


    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(modifiedHeaders['content-security-policy']).toBeDefined();
    expect(modifiedHeaders['content-security-policy']).not.toContain('upgrade-insecure-requests');
    expect(modifiedHeaders).toBeDefined();
    expect(page.route).toHaveBeenCalled();
    expect(page.route).toHaveBeenCalledTimes(1);
    expect(route.fetch).toHaveBeenCalled();
    expect(route.fetch).toHaveBeenCalledTimes(1);
    expect(route.fulfill).toHaveBeenCalledWith({
      response: expect.anything(),
      headers: {
        'content-security-policy': 'default-src self'
      }
    });
    expect(route.fulfill).toHaveBeenCalledTimes(1);
  });

  it('should remove upgrade-insecure-requests when it is the first directive', async () => {
    // Mock response headers with the directive at the beginning
    const headersWithDirectiveFirst = {
      'content-security-policy': 'upgrade-insecure-requests; default-src self'
    };

    // Mock route.fetch() to return headers with the directive at the beginning
    const route = {
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithDirectiveFirst
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    const modifiedHeaders = route.fulfill.mock.calls[0][0].headers;

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(modifiedHeaders['content-security-policy']).toBeDefined();
    expect(modifiedHeaders['content-security-policy']).not.toContain('upgrade-insecure-requests');
    expect(modifiedHeaders).toBeDefined();
    expect(page.route).toHaveBeenCalled();
    expect(page.route).toHaveBeenCalledTimes(1);
    expect(route.fetch).toHaveBeenCalled();
    expect(route.fetch).toHaveBeenCalledTimes(1);
    expect(route.fulfill).toHaveBeenCalledWith({
      response: expect.anything(),
      headers: {
        'content-security-policy': 'default-src self'
      }
    });
    expect(route.fulfill).toHaveBeenCalledTimes(1);
  });

  it('should correctly process when only upgrade-insecure-requests directive is present in CSP header', async () => {
    // Mock response headers with only upgrade-insecure-requests directive in CSP
    const headersWithOnlyUpgradeDirective = {
      'content-security-policy': 'upgrade-insecure-requests'
    };

    // Mock route.fetch() to return headers with only upgrade-insecure-requests directive
    const route = {
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithOnlyUpgradeDirective
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    const modifiedHeaders = route.fulfill.mock.calls[0][0].headers;

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(modifiedHeaders['content-security-policy']).toBeDefined();
    expect(modifiedHeaders['content-security-policy']).toBe('');
    expect(modifiedHeaders).toBeDefined();
    expect(page.route).toHaveBeenCalled();
    expect(page.route).toHaveBeenCalledTimes(1);
    expect(route.fetch).toHaveBeenCalled();
    expect(route.fetch).toHaveBeenCalledTimes(1);
    expect(route.fulfill).toHaveBeenCalledWith({
      response: expect.anything(),
      headers: {
        'content-security-policy': ''
      }
    });
    expect(route.fulfill).toHaveBeenCalledTimes(1);
  });


  it('should remove upgrade-insecure-requests from ExLibris CSP header', async () => {
    // Mock response headers
    const headersWithDirective = {
      'content-security-policy': "object-src blob: 'self' *.exlibrisgroup.com *.exlibrisgroup.com.cn www.google-analytics.com stats.g.doubleclick.net www.youtube.com search.library.nyu.edu; worker-src blob: 'self' *.exlibrisgroup.com *.exlibrisgroup.com.cn www.google-analytics.com stats.g.doubleclick.net www.youtube.com search.library.nyu.edu; upgrade-insecure-requests; report-uri /infra/CSPReportEndpoint.jsp; report-to csp-report-endpoint;"
    };

    // Mock route.fetch() to return headers with directive
    const route = {
      fetch: jest.fn().mockResolvedValue({
        headers: () => headersWithDirective,
      }),
      fulfill: jest.fn()
    };

    // Mock page.route()
    const page = {
      route: jest.fn().mockImplementation((_, handler) => handler(route))
    };

    await modifyCSPHeader(page);

    const modifiedHeaders = route.fulfill.mock.calls[0][0].headers;

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(modifiedHeaders['content-security-policy']).toBeDefined();
    expect(modifiedHeaders['content-security-policy']).not.toContain('upgrade-insecure-requests');
    expect(modifiedHeaders).toBeDefined();
    expect(page.route).toHaveBeenCalled();
    expect(page.route).toHaveBeenCalledTimes(1);
    expect(route.fetch).toHaveBeenCalled();
    expect(route.fetch).toHaveBeenCalledTimes(1);
    expect(route.fulfill).toHaveBeenCalledWith({
      response: expect.anything(),
      headers: {
        'content-security-policy': "object-src blob: 'self' *.exlibrisgroup.com *.exlibrisgroup.com.cn www.google-analytics.com stats.g.doubleclick.net www.youtube.com search.library.nyu.edu; worker-src blob: 'self' *.exlibrisgroup.com *.exlibrisgroup.com.cn www.google-analytics.com stats.g.doubleclick.net www.youtube.com search.library.nyu.edu; report-uri /infra/CSPReportEndpoint.jsp; report-to csp-report-endpoint;"
      }
    });
    expect(route.fulfill).toHaveBeenCalledTimes(1);
  });
});

describe('updateGoldenFiles', () => {

  beforeEach(() => {
    delete process.env.UPDATE_GOLDEN_FILES;
  });

  afterEach(() => {
      delete process.env.UPDATE_GOLDEN_FILES;
  });

  it('should return false when UPDATE_GOLDEN_FILES is not set', () => {
      expect(updateGoldenFiles()).toBe(false);
  });
  it.each(['TRUE', 'TrUe', 'tRUE', 'true'])(
      'should return true for different case variations of "true"', (value) => {
          process.env.UPDATE_GOLDEN_FILES = value;
          expect(updateGoldenFiles()).toBe(true);
      }
  );

  it.each(['FALSE', 'FaLsE', 'fALSE', 'false'])(
      'should return false for different case variations of "false"', (value) => {
          process.env.UPDATE_GOLDEN_FILES = value;
          expect(updateGoldenFiles()).toBe(false);
      }
  );

  it.each(['yes', 'no', '1', '0', 'false', 'FALSE', 'False', 'anyOtherValue', ''])(
    'should return false for any value other than variations of "true"', (value) => {
        process.env.UPDATE_GOLDEN_FILES = value;
        expect(updateGoldenFiles()).toBe(false);
    }
);

  it('should return false when UPDATE_GOLDEN_FILES is undefined', () => {
    expect(updateGoldenFiles()).toBe(false);
  });

  it('should return true when UPDATE_GOLDEN_FILES is set to true', () => {
    process.env.UPDATE_GOLDEN_FILES = 'true';
    expect(updateGoldenFiles()).toBe(true);
  });
});


describe('setPathAndQueryVid with VIEW constraint', () => {

  const allowedViews = [
    '01NYU_AD-AD',
    '01NYU_AD-AD_DEV',
    '01NYU_CU-CU',
    '01NYU_CU-CU_DEV',
    '01NYU_INST-NYU',
    '01NYU_INST-NYU_DEV',
    '01NYU_INST-TESTWS01',
    '01NYU_NYHS-NYHS',
    '01NYU_NYHS-NYHS_DEV',
    '01NYU_NYSID-NYSID',
    '01NYU_NYSID-NYSID_DEV',
    '01NYU_US-SH',
    '01NYU_US-SH_DEV',
  ];

  const currentView = process.env.VIEW;

  test(`replaces vid=[VID] correctly if VIEW is allowed`, () => {
      if (allowedViews.includes(currentView)) {
          const vid = currentView.replaceAll('-', ':');
          const pathAndQuery = 'example.com?vid=[VID]&otherParam=value';
          const result = setPathAndQueryVid(pathAndQuery, vid);
          expect(result).toBe(`example.com?vid=${vid}&otherParam=value`);
      } else {
          throw new Error(`Current VIEW '${currentView}' is not in the allowed list.`);
      }
  });


  test('throws error or fails for disallowed VIEW values', () => {
      const disallowedView = 'SOME_INVALID_VALUE';
      process.env.VIEW = disallowedView;
      const vid = process.env.VIEW.replaceAll('-', ':');
      const pathAndQuery = 'example.com?vid=[VID]&otherParam=value';

      // Test that an error is thrown
      expect(() => {
          setPathAndQueryVid(pathAndQuery, vid);
      }).toThrowError(`The provided vid value '${vid}' is not allowed.`);
  });
});
