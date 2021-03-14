import { useEffect, useState, useRef } from 'react';
import './App.css';
import * as _ from 'lodash';
import { throttle } from 'lodash';

const TotalTicks = 80;
const EventTypes = {
	raw: 'raw',
	deco: 'deco',
};

const HandlerTypes = {
	debounce: 'debounce',
	throttle: 'throttle',
};

let HANDLER = () => {};

function useInterval(callback: () => void, delay: number) {
	const savedCallback = useRef<() => void>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			(savedCallback.current as () => void)();
		}
		let id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
}

function App() {
	const [duration] = useState(100);
	const [tick, setTick] = useState(0);
	const [rawOn, setRawOn] = useState(false);
	const [decoOn, setDecoOn] = useState(false);
	const [active, setActive] = useState(false);
	const [decoHandlerType, setDecoHandlerType] = useState(HandlerTypes.debounce);

	const render = () => {
		const rawEvents = document.getElementById('raw-events') as HTMLDivElement;
		const decoratedEvents = document.getElementById(
			'decorated-events'
		) as HTMLDivElement;
		if (active && tick < TotalTicks) {
			document.getElementById('trigger')?.classList.add('active');
			rawEvents.append(getTick(EventTypes.raw));
			decoratedEvents.append(getTick(EventTypes.deco));
			setTick((t) => t + 1);
			setDecoOn(false);
			setRawOn(false);
		} else {
			document.getElementById('trigger')?.classList.remove('active');
			setActive(false);
		}
	};
	useInterval(render, duration);

	// set up event handlers for trigger area
	useEffect(() => {
		const trigger = document.getElementById('trigger');
		trigger?.removeEventListener('click', HANDLER);
		trigger?.removeEventListener('mousemove', HANDLER);

		const rawEventHandler = () => {
			setRawOn(true);
		};

		let decoHandler = () => {};

		switch (decoHandlerType) {
			case HandlerTypes.debounce:
				decoHandler = _.debounce(() => {
					setDecoOn(true);
				}, duration * 4);
				break;
			case HandlerTypes.throttle:
				decoHandler = throttle(
					() => {
						setDecoOn(true);
					},
					duration * 4,
					{ leading: true, trailing: false }
				);
				break;
		}

		const handler = () => {
			setActive(true);
			rawEventHandler();
			decoHandler();
		};

		HANDLER = handler;

		trigger?.addEventListener('click', handler);
		trigger?.addEventListener('mousemove', handler);
	}, [decoHandlerType, duration]);

	const getTick = (eventType: string) => {
		const tick = document.createElement('span');
		switch (eventType) {
			case EventTypes.raw:
				tick.className = rawOn ? 'color' : '';
				break;
			case EventTypes.deco:
				tick.className = decoOn ? 'color' : '';
				break;
		}
		return tick;
	};

	const reset = () => {
		clearTicks();
		setTick(0);
		setActive(false);
		setRawOn(false);
		setDecoOn(false);
	};

	const clearTicks = () => {
		const rawEvents = document.getElementById('raw-events') as HTMLDivElement;
		const decoratedEvents = document.getElementById(
			'decorated-events'
		) as HTMLDivElement;
		rawEvents.innerHTML = '';
		decoratedEvents.innerHTML = '';
	};

	const selectHanlder = (handler: string) => {
		if (handler in HandlerTypes) {
			setDecoHandlerType(handler);
		}
	};

	return (
		<div className="App">
			<label htmlFor="event-type">Currently Selected: </label>
			<select
				name="event-type"
				id="event-type"
				onChange={(e) => {
					selectHanlder(e.currentTarget.value);
				}}
			>
				{(Object.values(HandlerTypes) as string[]).map((val) => {
					return (
						<option value={val} key={val}>
							{val}
						</option>
					);
				})}
			</select>

			{/* control panel */}
			<br />
			<div id="trigger" className={`control trigger-area`}>
				Trigger
			</div>
			<div id="reset" className="control reset" onClick={reset}>
				Reset
			</div>

			<div className="stage">
				<h3>Raw Events Over Time</h3>
				<div id="raw-events" className="events"></div>
				<h3>Throttled Event</h3>
				<div id="decorated-events" className="events"></div>
			</div>
		</div>
	);
}

export default App;
