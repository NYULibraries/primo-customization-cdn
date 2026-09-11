const { setPathAndQueryVid, updateGoldenFiles } = require('../e2e/testutils');

describe('updateGoldenFiles', () => {
  const testValues = [
    { value: 'true', expected: true },
    { value: 'True', expected: true },
    { value: 'TRUE', expected: true },
    { value: 'TrUe', expected: true },
    { value: 'tRUE', expected: true },
    { value: 'false', expected: false },
    { value: 'False', expected: false },
    { value: 'FALSE', expected: false },
    { value: 'FaLsE', expected: false },
    { value: 'fALSE', expected: false },
    { value: 'yes', expected: false },
    { value: 'no', expected: false },
    { value: '1', expected: false },
    { value: '0', expected: false },
    { value: 'anyOtherValue', expected: false },
    { value: '', expected: false },
    { value: undefined, expected: false },
  ];

  beforeEach(() => {
    delete process.env.UPDATE_GOLDEN_FILES;
  });

  afterEach(() => {
      delete process.env.UPDATE_GOLDEN_FILES;
  });

  it('should return false when UPDATE_GOLDEN_FILES is not set', () => {
      expect(updateGoldenFiles()).toBe(false);
  });
  it.each(testValues)(
    'should return $expected for $value value', ({ value, expected }) => {
        process.env.UPDATE_GOLDEN_FILES = value;
        expect(updateGoldenFiles()).toBe(expected);
    }
  );
});

describe('setPathAndQueryVid with VIEW constraint', () => {

  const allowedViews = [
    '01NYU_AD-AD',
    '01NYU_AD-AD_DEV',
    '01NYU_CU-CU',
    '01NYU_CU-CU_DEV',
    '01NYU_INST-NYU',
    '01NYU_INST-NYU_DEV',
    '01NYU_NYHS-NYHS',
    '01NYU_NYHS-NYHS_DEV',
    '01NYU_NYSID-NYSID',
    '01NYU_NYSID-NYSID_DEV',
    '01NYU_US-SH',
    '01NYU_US-SH_DEV',
  ];

  test.each( allowedViews )( 'replaces vid=[VID] correctly if VIEW %s is allowed', currentView => {
          const vid = currentView.replaceAll('-', ':');
          const pathAndQuery = 'example.com?vid=[VID]&otherParam=value';
          const result = setPathAndQueryVid(pathAndQuery, vid);
          expect(result).toBe(`example.com?vid=${vid}&otherParam=value`);
  } );


  test('throws error or fails for disallowed VIEW values', () => {
      const disallowedView = 'SOME_INVALID_VALUE';
      process.env.VIEW = disallowedView;
      const vid = process.env.VIEW.replaceAll('-', ':');
      const pathAndQuery = 'example.com?vid=[VID]&otherParam=value';

      // Test that an error is thrown
      expect(() => {
          setPathAndQueryVid(pathAndQuery, vid);
      }).toThrow(`The provided vid value '${vid}' is not allowed.`);
  });
});
