#Battery Status API & Cat API#
This example illustrates how you can use the [Battery Status API](https://developer.mozilla.org/en/docs/Web/API/Battery_Status_API) to determine dynamic actions for your website.

What we do is detect the current battery percentage of the device and based on that dictate how often we call the [CatAPI](http://thecatapi.com/) to provide us with a new image for the gallery

The higher our battery percentage, the more frequently we call the API.

##Live Example##
I've created a live example so you can see this in action.[ Click here to view the example](http://code.runnable.com/VkgLTxB8kPFJTJ5f/output) on my runnable account. 

##Article##
This example will be part of my upcoming SitePoint article on the API. 

##Notes##
The CatAPI doesn't output in JSON so we need to use PHP to cURL to request images in an XML format for processing. If we had JSON we could bypass the need for PHP all together


