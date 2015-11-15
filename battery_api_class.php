  <?php
/*
 * Battery API Example class
 * Creates a class that deals with the interactions with the CAPAPI. 
 */
 
 class battery_api{
	
	//main API endpoint
	public $api_endpoint = 'http://thecatapi.com';

	/**
	 * Get images from our API.
	 * 
	 * Uses the CATAPI to request a series of images. The API will process the request and
	 * return an array of image information which will be displayed with the `display_image_items` function
	 * 
	 * @param string $method The API method that will be called
	 * @param array $arguments The arguments to pass to the API in order to receive our images
	 * @return array Returns an array of images from the api or false on error
	 * 
	 */
	public function get_image_items($method, $arguments = array()){
		
		//supplying optional arguments
		if($arguments){
			
			//loop through our passed arguments add urlencode them 
			$encoded_arguments_array = array();
			foreach($arguments as $argument_key => $argument_value){
				$encoded_arguments_array[] = urlencode($argument_key) . '=' . urlencode($argument_value);
			}
			
			//create a string of our options to pass to the API
			$encoded_arguments = implode('&',$encoded_arguments_array);		
			//build the final API url to call
			$api_url = $this->api_endpoint . $method . $encoded_arguments;
			
		}else{
			//build the final API url to call
			$api_url = $this->api_endpoint . $method;
		}

		//start our curl
		$curl = curl_init();

		curl_setopt($curl, CURLOPT_URL, $api_url);
		curl_setopt($curl, CURLOPT_TIMEOUT, 60);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		
	
	
		$curl_content = curl_exec($curl);
		$curl_error = curl_error($curl);
		$curl_error_no = curl_errno($curl);
		
		//end curl
		curl_close($curl);
		
		
		//if we have no errors and returned content
		if(empty($curl_error) && ($curl_error_no == 0) && $curl_content){
			
		
			
			$images = array();
			//load our returned content in XML
			$xml = new SimpleXMLElement($curl_content);
			
			//go through our XML and find the image info for each
			foreach($xml->data->images->image as $image){
				$image_url = $image->url;
				$image_id = $image->id;
				$image_source_url = $image->source_url;
				
				//add our new image
				$images[(string) $image_id] = array(
					'url'		=> (string) $image_url,
					'id'		=> (string) $image_id,
					'source_url'	=> (string) $image_source_url
				);
			}
			
			return $images;
		}else{
			//either we have an error or nothing returned
			return false;
		}

		
	}

	/**
	* Displays the summary battery information to the front end
 	* 
	* Displays a full listing of information to the end user including the support for the battery API, device charge level
	* ajax update interval and the time until the next update. 
	* 
	*/
	public function display_battery_information_summary(){
		
		$html = '';
		
		$html .= '<article class="battery-info">';
		$html   .= '<div class="support-title"><h3></h3></div>';
		$html 	.= '<div class="supports"><b>Device Battery API: </b><span></span></div>';
		$html 	.= '<div class="battery-level"><b>Battery level: </b><span></span></div>';
		$html 	.= '<div class="battery-charging"><b>Battery is charging: </b><span></span></div>';
		$html   .= '<div class="call-interval"><b>Update Interval: </b><span></span></div>';
		$html 	.= '<div class="next-call"><b>Next update in: </b><span></span></div>';
		
		$html   .= '<div class="simulate-container">';
		$html   	.= '<p>Simulate the battery state</p>';
		$html   	.= '<div class="button simulate-level" data-simulate-state="high">High Battery</div>';
		$html   	.= '<div class="button simulate-level" data-simulate-state="medium">Medium Battery</div>';
		$html   	.= '<div class="button simulate-level" data-simulate-state="low">Low Battery</div>';
		$html		.= '<div class="button simulate-level" data-simulate-state="critical">Critical Battery</div>';
		$html	.= '</div>';
		$html .= '</article>';
		
		echo $html;
	}


	/**
	* Displays additional information about the battery charge interval levels
 	* 
	* Outlines the current state based on the percentage of the battery charge. Higher levels will have quicker Ajax intervals
	* 
	* 
	*/
	function display_battery_example_description(){
		
		$html = '';
		$html .= '<header>';
		$html 	.= '<h1>Battery API / Cat API Example</h1>';
		$html 	.= '<h3>This example loads cat images from the CATAPI dynamicaly. The duration in which images are pulled depends on your battery state</h3>';
		$html 	.= '<ul>';
		$html 		.= '<li>High battery (100% - 70%) - Every 3 seconds</li>';
		$html 		.= '<li>Medium battery (69% - 30%) - Every 5 seconds</li>';
		$html 		.= '<li>Low battery (29% - 10%) - Every 8 seconds</li>';
		$html 		.= '<li>Critical battey (9% - 0%) - Manual Refresh Only</li>';
		$html 	.= '</ul>';
		$html .= '</header>';
			
		echo $html;
	}

	/**
	* Displays the images to the front end
 	* 
	* Displays an array of image items to the front-end. This image array is a processed array returned by the 
	* `get_image_items` function. We simply loop through all of our images and display them
	* 
	*/
	public function display_image_items($images_array){
			
		
		$html = '';
		
		if($images_array){
			$html .= '<div class="load-more">';
				$html .= '<div class="load-button">Manually load an image</div>';
			$html .= '</div>';
			$html .= '<div class="gallery-grid cf">';
			foreach($images_array as $image){
				$html .= '<div class="gallery-item">';
					$html .= '<div class="image-container">';
						$html .= '<div class="inner">';
							$html .= '<img src="' . $image['url'] . '"/>';
						$html .= '</div>';
					$html .= '</div>';
				$html .= '</div>';
			}
			$html .= '</div>';
			
		}
		
		echo  $html;
	}
	
}



?>