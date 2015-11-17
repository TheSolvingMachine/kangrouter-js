
var assert = require('assert') 

exports['test'] = function(){

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
	kangrouter=require("./index.js")
	api=kangrouter(process.env.API_KEY,process.env.LICENSE_ID)
	api.solve(problem)
		.done(function(solution){
			  assert.equal(solution["type"],"total")
			  assert.equal(solution["jobsScheduled"].length,1)
			})
};    