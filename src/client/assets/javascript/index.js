// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
const store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
	race_running: false
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
		getRacers()
	} catch(error) {
		console.debug("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		} else if (target.closest('.card.track')) {
			const realTarget = target.closest('.card.track')
			handleSelectTrack(realTarget)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		} else if (target.closest('.card.podracer')) {
			const realTarget = target.closest('.card.podracer')
			handleSelectPodRacer(realTarget)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()

			const trackIndex = store.track_id + (store.track_id - 1)
			const trackName = document.getElementById('tracks').childNodes[1].childNodes[trackIndex].children[0].innerHTML

			// start race
			handleCreateRace(trackName)
		}

		// Handle acceleration click while race running
		if (target.matches('#gas-peddle') && store.race_running) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms))
	} catch(error) {
		console.debug("an error shouldn't be possible here")
		console.error(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace(trackName) {
	// render starting UI
	renderAt('#race', renderRaceStartView(trackName))

	// Get player_id and track_id from the store
	const player_id = store.player_id
	const track_id = store.track_id

	// invoke the API call to create the race, then save the result
	const race = await createRace(player_id, track_id)

	// Update the store with the race id
	store.race_id = race.ID - 1

	// The race has been created, now start the countdown
	await runCountdown()

	await startRace(store.race_id)

	await runRace(store.race_id)
}

function runRace(raceID) {
	return new Promise(resolve => {
		const raceInterval = setInterval(function(){
			getRace(store.race_id)
			.then(res => {
				if (res.status === 'in-progress') {
					renderAt('#leaderBoard', raceProgress(res.positions))
					store.race_running = true
				} else if (res.status === 'finished') {
					clearInterval(raceInterval) // to stop the interval from repeating
					store.race_running = false // to block further user acceleration input after race
					renderAt('#race', resultsView(res.positions)) // to render the results view
					resolve(res) // resolve the promise
				}
			})
			.catch(err => console.error("Problem with getRace request::", err))
		}, 500)
	})
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// Use Javascript's built in setInterval method to count down once per second
			const interval = setInterval(function(){
				if (timer > 0) {
					// Decrement the countdown for the user
					document.getElementById('big-numbers').innerHTML = --timer
				} else {
					// If the countdown is done, clear the interval, resolve the promise, and return
					clearInterval(interval)
					resolve()
				}
			}, 1000)
		})
	} catch(error) {
		console.error(error)
	}
}

function handleSelectPodRacer(target) {
	console.debug("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// Save the selected racer to the store
	store.player_id = parseInt(target.id)
}

function handleSelectTrack(target) {
	console.debug("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// Save the selected track id to the store
	store.track_id = parseInt(target.id)

}

async function handleAccelerate() {
	console.debug("accelerate button clicked")
	await accelerate(store.race_id)
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(trackName, racers) {
	return `
		<header>
			<h1>Race: ${trackName}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	console.debug("store.player_id equals: " + store.player_id)
	const userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

function getTracks() {
	// return fetch tracks promise
	return fetch(`${SERVER}/api/tracks`)
		.then(response => response.json())
		.then(tracks => {
			const html = renderTrackCards(tracks)
			renderAt('#tracks', html)
		})
		.catch(err => console.error("Problem with getTracks request::", err))
}

function getRacers() {
	// return fetch cars promise
	return fetch(`${SERVER}/api/cars`)
		.then(response => response.json())
		.then((racers) => {
			const html = renderRacerCars(racers)
			renderAt('#racers', html)
		})
		.catch(err => console.error("Problem with getRacers request::", err))
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }

	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.error("Problem with createRace request::", err))
}

function getRace(id) {
	return fetch(`${SERVER}/api/races/${id}`)
		.then(response => response.json())
		.catch(err => console.error("Problem with getRace request::", err))
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts()
	})
	.then(res => res)
	.catch(err => console.error("Problem with startRace request::", err))
}

function accelerate(id) {
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts()
	})
	.then(res => res)
	.catch(err => console.error("Problem with accelerate request::", err))
}
