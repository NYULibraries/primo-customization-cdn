const { modifyCSPHeader, setPathAndQueryVid, updateGoldenFiles } = require('../e2e/testutils');

describe('modifyCSPHeader', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove upgrade-insecure-requests from CSP header', async () => {
    // Mock response headers
    const headersWithDirective = {
      'content-security-policy': 'default-src self; upgrade-insecure-requests'
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

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(headersWithDirective['content-security-policy']).toBeDefined();
    expect(headersWithDirective['content-security-policy']).toContain('upgrade-insecure-requests');
    expect(headersWithDirective).toBeDefined();
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

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(headersWithoutDirective['content-security-policy']).toBeDefined();
    expect(headersWithoutDirective['content-security-policy']).not.toContain('upgrade-insecure-requests');
    expect(headersWithoutDirective).toBeDefined();
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

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(headersWithDirectiveFirst['content-security-policy']).toBeDefined();
    expect(headersWithDirectiveFirst['content-security-policy']).toContain('upgrade-insecure-requests');
    expect(headersWithDirectiveFirst).toBeDefined();
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

    // Assertions
    expect(page).toBeDefined();
    expect(page).not.toBeNull();
    expect(page).toBeTruthy();
    expect(headersWithDirective['content-security-policy']).toBeDefined();
    expect(headersWithDirective['content-security-policy']).toContain('upgrade-insecure-requests');
    expect(headersWithDirective).toBeDefined();
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
    delete process.env.UPDATE_GOLDEN_FILES;
    expect(updateGoldenFiles()).toBe(false);
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

  allowedViews.forEach((allowedView) => {
      describe(`when VIEW is ${allowedView}`, () => {
          // Set the VIEW environment variable to the allowed value
          beforeEach(() => {
              process.env.VIEW = allowedView;
          });

          // Clean up the VIEW environment variable after each test
          afterEach(() => {
              delete process.env.VIEW;
          });

          test(`replaces vid=[VID] correctly for ${allowedView}`, () => {
              const vid = process.env.VIEW.replaceAll('-', ':');
              const pathAndQuery = 'example.com?vid=[VID]&otherParam=value';
              const result = setPathAndQueryVid(pathAndQuery, vid);
              expect(result).toBe(`example.com?vid=${vid}&otherParam=value`);
          });
      });
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
