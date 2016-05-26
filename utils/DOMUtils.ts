export class DOMUtils
{
	/**
	 * The name of the silly greensock injected var
	 */
	private static GS_TRANSFORM_KEY = '_gsTransform';

	/**
	 * Get a position value transformed by Greensock.
	 * Ex X or Y while a transition on a any object.
	 */
	static getGreensockValue (pTarget:any):number
	{
		// No target
		if (pTarget == null)
		{
			return null;
		}

		// Transform key available
		else if (DOMUtils.GS_TRANSFORM_KEY in pTarget)
		{
			return pTarget[DOMUtils.GS_TRANSFORM_KEY];
		}

		// Transform key available in first child (jQuery)
		else if ((0 in pTarget) && DOMUtils.GS_TRANSFORM_KEY in pTarget[0])
		{
			return pTarget[0][DOMUtils.GS_TRANSFORM_KEY];
		}

		// Oops
		else return null;
	}

	/**
	 * Get size of scrollbar following client env.
	 * Warning hazardous code !
	 * @returns the default size of a vertical scrollbar
	 */
	static getScrollBarSize ():Number
	{
		// Create temp scrollable div
		var $scrollableDiv = $('<div></div>').addClass('verticalScroll').css({
			position: 'absolute',
			width: 100,
			height: 100,
			overflow: 'scroll',
			top: -9999
		});

		// Append it to body
		$scrollableDiv.appendTo($('body'));

		// Measure inner and outer size
		var scrollBarWidth = $scrollableDiv[0].offsetWidth - $scrollableDiv[0].clientWidth;

		// Remove from dom
		$scrollableDiv.remove();

		// Return measured size and pray
		return scrollBarWidth;
	}

	/**
	 * Get the height of a JQuery element at size 'auto'.
	 * Will measure height at auto and rollback to previous height in a blink.
	 * Element have to be in DOM. Preferable to have it visible (with no display:none parents)
	 * @param $pElement The jquery element to measure. Only one element please :)
	 * @param pIncludeBorderAndPadding If we have to include padding and border in measurement
	 * @param pIncludeMargins If we have to include padding and border in measurement
	 * @returns {number} The height in pixels
	 */
	static getAutoHeight ($pElement:JQuery, pIncludeBorderAndPadding = false, pIncludeMargins = false):number
	{
		// Get the current height value
		var currentHeightValue = $pElement.css('height');

		// Set to auto
		$pElement.css({height: 'auto'});

		// Measure the auto height
		var descriptionHeight = pIncludeBorderAndPadding ? $pElement.outerHeight(pIncludeMargins) : $pElement.height();

		// Roll back to the first measured height value
		$pElement.css({height: currentHeightValue});

		// Return auto height
		return descriptionHeight;
	}
}