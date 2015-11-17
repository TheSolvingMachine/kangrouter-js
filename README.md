[![Build Status](https://travis-ci.org/TheSolvingMachine/kangrouter-js.svg?branch=master)](https://travis-ci.org/TheSolvingMachine/kangrouter-js)

# kangrouter-js

Javascript client for KangRouter. KangRouter is an application for large scale transportation service optimization (see https://thesolvingmachine.com/kangrouter). 
    
## Installation

This library may be used in the browser, or in [Node.js](https://nodejs.org/en/) via npm: 

```bash
npm install kangrouter-js
```

## Usage

### Preliminaries

Using the library from within [Node.js](https://nodejs.org/en/) requires the following line:

```javascript
KangRouterJS = require("kangrouter-js")
```

For interacting with the API, both an *apiKey* and a *licenseId* are required. Please
obtain them from https://thesolvingmachine.com/account, and use them to initialize the API:

```javascript
api = KangRouterJS(apiKey,licenseId)
```


### An example problem

Input problems are described as a javascript object. As a (simplistic) example, consider the problem of taking [Fernando Pessoa](https://en.wikipedia.org/wiki/Fernando_Pessoa) home after a medical appointment at the [Garcia de Orta Hospital](http://www.hgo.pt/). He is ready to leave the hospital after 13:00, and must be home no later than 14:15. Assume that the vehicle available for transportation is parked in [Sintra](https://en.wikipedia.org/wiki/Sintra), has 3 seats and room for 2 wheelchairs. Fernando is on a wheelchair, so we allocate 5 minutes for pickup and dropoff. Additionally, the driver always has a 60 minute lunch break between 12:00 and 14:00.

```javascript
problem = {
  "nbResources": 2,
  "jobs": [
    {
      "jobId": "Job01",
      "origLat": "38.674921",
      "origLon": "-9.175401",
      "destLat": "38.716860",
      "destLon": "-9.162417",
      "minStartTime": "13:00",
      "maxEndTime": "14:15",
      "pickupDuration": 5,
      "deliveryDuration": 5,
      "cargoId": "Fernando Pessoa",
      "consumptions": [
        0,
        1
      ]
    }
  ],
  "vehicles": [
    {
      "vehicleId": "12-AS-46",
      "depotLat": "38.806842",
      "depotLon": "-9.382556",
      "minStartTime": "07:00",
      "maxEndTime": "22:00",
      "maxWorkDuration": 540,
      "capacities": [
        2,
        3,
      ],
      "breaks": [
        {
          "breakId": "Lunch",
          "minStartTime": "12:00",
          "maxEndTime": "14:00",
          "duration": 60
        }
      ],
      "overspeed": 1.25
    }
  ]
}
```
Interesting problems have multiple jobs and multiple vehicles, but the example above should be enough to get you going.

### Interacting with the solver

Once a new problem is submitted to the server, the solving process runs asynchronously. Interacting with the solver is event driven. Here is the general usage pattern:

```javascript
api.solve(problem)
   .progress(function(status){console.log(status);})
   .done(function(solution){console.log(solution);})
```

This example creates a new solver for the problem described above, reports progress to the console, and finally prints the solution when the solver terminates.

Under the hoods, the `solve` method returns a jQuery [deferred](https://api.jquery.com/category/deferred-object/)  object with a set of hooks where user defined callback functions may be attached. These are useful to:

#### Check solving status

```javascript
progress(progressCallback[,progressCallbacks])
```

Called when the solver generates progress notifications. The installed callbacks must have a single argument which will be instantiated with a `Status` object, for example

```javascript
{
  'execStatus': 'completed',
  'nbJobsDiscarded': 0,
  'solverEndTime': 'Sat Nov 14 20:55:02 2015 GMT',
  'solverStartTime': 'Sat Nov 14 20:54:55 2015 GMT',
  'totalDistance': 75,
  'warnings': [
    {
      'code': 5, 
      'info': "Unpaired job 'Job01'."
    }
  ]
}
```

#### Get the solution

```javascript
done(doneCallback[,doneCallbacks])
```

Called when the solver terminates successfully. The installed callbacks must have a single argument which will be instantiated with the `Solution` object, showing at what times, or time intervals, drivers must leave their depots, start their work breaks, or perform pickup/delivery actions:

```javascript
{
  'jobsScheduled': [
    {
      'jobId': 'Job01',
      'maxEndTime': '14:15',
      'maxStartTime': '13:55',
      'minEndTime': '13:20',
      'minStartTime': '13:00',
      'vehicleId': '12-AS-46'
    }
  ],
  'type': 'total',
  'vehiclesScheduled': [
    {
      'breaks': [
        {
          'breakId': 'Lunch',
          'maxEndTime': '13:55',
          'maxStartTime': '12:55',
          'minEndTime': '13:00',
          'minStartTime': '12:00'
        }
      ],
      'maxEndTime': '21:30',
      'maxStartTime': '12:30',
      'minEndTime': '13:40',
      'minStartTime': '07:00',
      'vehicleId': '12-AS-46'
    }
  ]
}
```

### Terminate the solving process
To stop a running solver:

```javascript
api.stop(solverId)
```

## More documentation
For a complete description of the KangRouter API please visit https://thesolvingmachine.com/swagger/kangrouter/srv/.
[![Build Status](https://travis-ci.org/TheSolvingMachine/kangrouter-py.svg?branch=master)](https://travis-ci.org/TheSolvingMachine/kangrouter-py)

