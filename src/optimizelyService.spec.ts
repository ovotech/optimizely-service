import optimizelyService from './optimizelyService';

describe(`Optimizely utils`, () => {
  const experimentStates = {
    1: {
      experimentName: 'experiment 1',
      variation: { id: 'id_1', name: 'some variation' }
    },
    2: {
      experimentName: 'experiment 2',
      variation: { id: 'id_2', name: 'some other variation' }
    },
    3: {
      experimentName: 'experiment 3',
      variation: { id: 'id_3', name: 'yet another variation' }
    }
  };

  beforeEach(() => {
    window.optimizely = {
      get: jest.fn(),
      push: jest.fn()
    };
  });

  describe(`getActiveVariation`, () => {
    it(`can get the active variation when an experiment can be found`, () => {
      (window.optimizely!.get as jest.Mock).mockReturnValue({
        getExperimentStates: () => ({
          0: {
            experimentName: 'some experiment',
            variation: { id: 'some_id', name: 'some variation' }
          }
        })
      });

      expect(optimizelyService.getActiveVariation('some experiment')).toEqual(
        'some variation'
      );
    });

    it(`returns 'Original' when an experiment is not found`, () => {
      (window.optimizely!.get as jest.Mock).mockReturnValue({
        getExperimentStates: () => ({})
      });

      expect(optimizelyService.getActiveVariation('some experiment')).toEqual(
        'Original'
      );
    });
  });

  describe(`getActiveExperiment`, () => {
    beforeEach(() => {
      (window.optimizely!.get as jest.Mock).mockReturnValue({
        getExperimentStates: () => experimentStates
      });
    });

    it(`returns undefined when Optimizely is not available`, () => {
      window.optimizely = undefined;

      expect(
        optimizelyService.getActiveExperiment('experiment 1')
      ).toBeUndefined();
    });

    it(`can get the active experiment`, () => {
      expect(optimizelyService.getActiveExperiment('experiment 1')).toEqual({
        experimentName: 'experiment 1',
        variation: { id: 'id_1', name: 'some variation' }
      });
    });
  });

  describe(`activeVariationIs`, () => {
    beforeEach(() => {
      (window.optimizely!.get as jest.Mock).mockReturnValue({
        getExperimentStates: () => ({
          0: {
            experimentName: 'some experiment',
            variation: { id: 'some_id', name: 'some variation' }
          }
        })
      });
    });

    it(`returns true when the active variation is found`, () => {
      expect(
        optimizelyService.activeVariationIs('some experiment', 'some variation')
      ).toBe(true);
    });

    it(`returns false when the active variation is not found`, () => {
      expect(
        optimizelyService.activeVariationIs('some experiment', 'somethingElse')
      ).toBe(false);
    });
  });

  describe(`events`, () => {
    describe(`pushEvent`, () => {
      it(`pushes an 'event' event when optimizely is available`, () => {
        optimizelyService.pushEvent('some event');

        expect(window.optimizely!.push).toHaveBeenCalled();
      });
    });

    describe(`activatePage`, () => {
      it(`pushes a 'page' event when optimizely is available`, () => {
        optimizelyService.activatePage('some page');

        expect(window.optimizely!.push).toHaveBeenCalled();
      });
    });

    describe(`trackUserAttributes`, () => {
      it(`pushes a 'user' event when optimizely is available`, () => {
        optimizelyService.trackUserAttributes({ some: 'attribute' });

        expect(window.optimizely!.push).toHaveBeenCalled();
      });
    });
  });
});
