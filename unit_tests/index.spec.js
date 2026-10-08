const { setPathAndQueryVid } = require('../e2e/testutils');

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
