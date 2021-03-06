export interface IFrameHandler
{
	externalHandler: (pEvent:Event) => void;
	proxyHandler: (pEvent:Event) => void;
}

export class TimerUtils
{
	// TODO : Doc

	static polyfillRequestAnimationFrame ()
	{
		if (!('requestAnimationFrame' in window))
		{
			window.requestAnimationFrame = (
				window['webkitRequestAnimationFrame'] ||
				window['mozRequestAnimationFrame'] ||
				window['oRequestAnimationFrame'] ||
				window['msRequestAnimationFrame'] ||
				function (pCallback)
				{
					window.setTimeout(pCallback, 1000 / TimerUtils.__fps);
				}
			);
		}
	}


	/**
	 * Stored handlers frames.
	 */
	private static __framesHandlers:IFrameHandler[]		= [];

	/**
	 * Current animations framerate (for all TweenLite / TweenMax animations)
	 */
	private static __fps								= 60;


	/**
	 * Add a listener on every frames using TweenLite.
	 * This will use requestAnimationFrame if possible, otherwise setInterval.
	 * @param pTarget Target to keep the scope on your handler (99% : this)
	 * @param pHandler The handler to call every frames
	 */
	static addFrameHandler (pTarget:any, pHandler:(pEvent:Event) => void):void
	{
		// Wrap the handler in a proxy function to keep the scope target
		var proxyHandler = function (pEvent:Event):void
		{
			pHandler.call(pTarget, pEvent);
		};

		// Listener the frames on the proxy
		TweenLite.ticker.addEventListener('tick', proxyHandler);

		// Store the proxy and external handler association for future deletion
		this.__framesHandlers.push({
			externalHandler: pHandler,
			proxyHandler: proxyHandler
		});
	}

	/**
	 * Remove a frame listener on a specific handler.
	 * @param pHandler The handler on which you attached a addFrameHandler
	 * @returns True if the handler was found and removed
	 */
	static removeFrameHandler (pHandler:(pEvent:Event) => void):boolean
	{
		// Create a new array to remove the handler
		var newFramesHandlers:IFrameHandler[] = [];
		var found = false;

		// Browse stored handlers
		const total = this.__framesHandlers.length;
		for (var i = 0; i < total; i ++)
		{
			// If this is our external handler, remove the listener on TweenLite
			// And don't insert it in the new array
			if (this.__framesHandlers[i].externalHandler == pHandler)
			{
				TweenLite.ticker.removeEventListener("tick", this.__framesHandlers[i].proxyHandler);
				found = true;
			}

			// Else, keep it in the new array
			else
			{
				newFramesHandlers.push(this.__framesHandlers[i]);
			}
		}

		// Store the new handlers array
		this.__framesHandlers = newFramesHandlers;

		return found;
	}

	/**
	 * Change framerate of all TweenLite / TweenMax animations.
	 */
	static get fps ():number { return this.__fps; }
	static set fps (pValue:number)
	{
		// Clamp it and store it
		this.__fps = Math.max(0.1, Math.min(pValue, 75));

		// Apply on tweenlite
		TweenLite.ticker['fps'](this.__fps);
	}
}