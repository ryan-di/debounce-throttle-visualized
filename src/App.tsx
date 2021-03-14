import { useEffect } from 'react';
import './App.css';

function App() {
	useEffect(() => {}, []);

	return (
		<div className="App">
			<label htmlFor="event-type">Currently Selected: </label>
			<select name="event-type" id="event-type">
				<option value="throttle">Throttle</option>
				<option value="debounce">Debounce</option>
			</select>

			{/* control panel */}
			<br />
			<div className="control trigger-area">Trigger Area</div>
			<div className="control reset">Reset</div>

			<div className="stage">
				<h3>Raw Events Over Time</h3>
				<div id="raw-events" className="events"></div>
				<h3>Throttled Event</h3>
				<div id="decorated-event" className="events"></div>
			</div>
		</div>
	);
}

export default App;
