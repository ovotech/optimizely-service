declare global {
  interface Window {
    optimizely?: Optimizely;
  }
}

type Optimizely = {
  get: (
    type: string
  ) => {
    getExperimentStates: (state: {
      isActive: boolean;
    }) => {
      [id: string]: OptimizelyExperimentState;
    };
  };
  push(event: OptimizelyEvent): void;
};

type OptimizelyEvent = {
  type: 'event' | 'page' | 'user';
  eventName?: string;
  tags?: OptimizelyTags;
  pageName?: string;
  attributes?: OptimizelyTags;
};

type OptimizelyTags = {
  [key: string]: string;
};

type OptimizelyExperimentState = {
  experimentName: string;
  variation: {
    id: string;
    name: string;
  };
};

const isOptimizelyAvailable = (): boolean => !!window.optimizely;

const getActiveVariation = (experimentName: string): string => {
  const experiment = getActiveExperiment(experimentName);

  return experiment ? experiment.variation.name : 'Original';
};

const getActiveExperiment = (
  experimentName: string
): OptimizelyExperimentState | undefined =>
  isOptimizelyAvailable()
    ? Object.values(
        window.optimizely!.get('state').getExperimentStates({ isActive: true })
      ).find(e => e.experimentName === experimentName)
    : undefined;

const activeVariationIs = (
  experimentName: string,
  variationName: string
): boolean => getActiveVariation(experimentName) === variationName;

const pushEvent = (eventName: string, tags: OptimizelyTags = {}): void => {
  if (isOptimizelyAvailable()) {
    window.optimizely!.push({
      type: 'event',
      eventName,
      tags
    });
  }
};

const activatePage = (pageApiName: string): void => {
  if (isOptimizelyAvailable()) {
    window.optimizely!.push({
      type: 'page',
      pageName: pageApiName
    });
  }
};

const trackUserAttributes = (attributes: OptimizelyTags): void => {
  if (isOptimizelyAvailable()) {
    window.optimizely!.push({
      type: 'user',
      attributes
    });
  }
};

const optimizelyService = {
  getActiveVariation,
  getActiveExperiment,
  activeVariationIs,
  pushEvent,
  activatePage,
  trackUserAttributes
};

export default optimizelyService;
