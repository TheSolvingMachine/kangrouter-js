[![Build Status](https://travis-ci.org/TheSolvingMachine/kangrouter-js.svg)](https://travis-ci.org/TheSolvingMachine/kangrouter-js)

# kangrouter-js

Javascript client for [KangRouter](https://thesolvingmachine.com/kangrouter/) - pickup/delivery transportation services optimization. 
    
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

Input problems are described as a javascript object. As a (simplistic) example, consider the problem of:
* Taking [Alberto Caeiro](https://en.wikipedia.org/wiki/Fernando_Pessoa#Alberto_Caeiro) home after a medical appointment at the [Garcia de Orta Hospital](http://www.hgo.pt/). He is ready to leave the hospital after 13:00, and must be home no later than 14:15. Alberto is on a wheelchair, so we allocate 5 minutes for pickup and dropoff.
* Picking [Ricardo Reis](https://en.wikipedia.org/wiki/Fernando_Pessoa#Ricardo_Reis) at the [Brasileira](https://en.wikipedia.org/wiki/Caf%C3%A9_A_Brasileira) café, and take him to a beach restaurant. He wants to be there no later than 12:15. Ricardo takes a regular seat.

Assume that the vehicle available for transportation is parked in [Sintra](https://en.wikipedia.org/wiki/Sintra), has 3 seats and room for 2 wheelchairs.  Additionally, the driver must have a 60 minute lunch break between 12:00 and 14:00. 

This problem translates to the following object:

```javascript
problem = {
  "nbResources": 2,
  "jobs": [
    {
      "jobId": "Pickup Alberto at the hospital",
      "origLat": "38.674921",
      "origLon": "-9.175401",
      "destLat": "38.716860",
      "destLon": "-9.162417",
      "minStartTime": "13:00",
      "maxEndTime": "14:15",
      "pickupDuration": 5,
      "deliveryDuration": 5,
      "consumptions": [0,1]
    },
    {
      "jobId": "Take Ricardo to the beach",
      "origLat": "38.710835",
      "origLon": "-9.142143",
      "destLat": "38.634080",
      "destLon": "-9.230549",
      "maxEndTime": "12:15",
      "pickupDuration": 1,
      "deliveryDuration": 1,
      "consumptions": [1,0]
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
      "capacities": [2,3],
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
Interesting problems have many jobs and vehicles, but the example above should be enough to get you going.

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
  "execStatus": "completed",
  "nbJobsDiscarded": 0,
  "solverEndTime": "Wed Nov 18 11:59:48 2015 GMT",
  "solverStartTime": "Wed Nov 18 11:59:40 2015 GMT",
  "totalDistance": 98,
}
```

#### Get the solution

```javascript
done(doneCallback[,doneCallbacks])
```

Called when the solver terminates successfully. The installed callbacks must have a single argument which will be instantiated with the `Solution` object, showing at what times, or time intervals, drivers must leave their depots, start their work breaks, or perform pickup/delivery actions:

```javascript
{
  "jobsScheduled": [
    {
      "jobId": "Pickup Alberto at the hospital",
      "maxEndTime": "14:15",
      "maxStartTime": "13:55",
      "minEndTime": "13:20",
      "minStartTime": "13:00",
      "vehicleId": "12-AS-46"
    },
    {
      "jobId": "Take Ricardo to the beach",
      "maxEndTime": "12:15",
      "maxStartTime": "11:59",
      "minEndTime": "11:14",
      "minStartTime": "10:58",
      "vehicleId": "12-AS-46"
    }
  ],
  "type": "total",
  "vehiclesScheduled": [
    {
      "breaks": [
        {
          "breakId": "Lunch",
          "maxEndTime": "13:55",
          "maxStartTime": "12:55",
          "minEndTime": "13:00",
          "minStartTime": "12:00"
        }
      ],
      "maxEndTime": "14:35",
      "maxStartTime": "11:38",
      "minEndTime": "13:40",
      "minStartTime": "10:37",
      "vehicleId": "12-AS-46"
    }
  ]
}
```

### Terminate the solving process
To stop a running solver:

```javascript
api.stop(solverId)
```

## Links
* [KangRouter API Reference](https://thesolvingmachine.com/kangrouter/doc/en/)
* [KangRouter API Playground](https://thesolvingmachine.com/swagger/kangrouter/srv/)
