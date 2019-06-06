[![npm version](https://badge.fury.io/js/optimizely-service.svg)](https://badge.fury.io/js/optimizely-service) ![NPM](https://img.shields.io/npm/l/optimizely-service.svg)

# optimizely-service

A simple interface for interracting with [Optimizely](https://optimizely.com).

## A simple use case (React)

**_Note: the following assumes everything is set up in the Optimizely web interface and the Optimizely script has been loaded_**

Suppose we have a simple A/B test set up with a control (we'll call it `Original`) and a variant (we'll call it `Variant`).

For this experiment (we'll call it `Experiment A`), the user will

We want to render `ComponentA` if the user is placed in the `Original` bucket, or render `ComponentB` if the user is placed in the `Variant` bucket.

The metric we will be tracking is when the component is clicked (we will call this event `Clicked`).

```js
import React, { Component } from 'react';
import optimizelyService from 'optimizely-service';

import { ComponentA } from '../ComponentA';
import { ComponentB } from '../ComponentB';

class Foo extends Component {
  constructor(props) {
    super(props);

    optimizelyService.activatePage('MyPage');

    this.state = {
      showComponentB: optimizelyService.activeVariationIs(
        'Experiment A',
        'Variant'
      )
    };
  }

  handleClick = () => optimizelyService.pushEvent('Clicked');

  render() {
    return this.state.showComponentB ? (
      <ComponentB onClick={this.handleClick} />
    ) : (
      <ComponentA onClick={this.handleClick} />
    );
  }
}
```

That's it!

## Exported functions

The code example above gives a pretty simple overview of what this library can provide. Here is a list of all of the functions supported by `optimizely-service`:

| Function            | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| getActiveVariation  | Gets the name of the currently activated variation for a given experiment |
| getActiveExperiment | Gets the state of the given experiment                                    |
| activeVariationIs   | Determines if a variation for a given experiment is active                |
| pushEvent           | Pushes an event to Optimizely                                             |
| activatePage        | Activates a Page API                                                      |
| trackUserAttributes | Pushes user attributes to Optimizely                                      |

## Contribution

Not all of Optimizely's functionality is supported by this library. It was created mainly to support the most common use case of a basic A/B test with some event tracking. All PR's to help increase the amount of Optimizely functionality are fully welcome.
