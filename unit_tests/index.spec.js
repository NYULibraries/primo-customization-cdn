const { modifyCSPHeader } = require('../e2e/testutils');

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

test.todo('setPathAndQueryVid');
test.todo('updateGoldenFiles');