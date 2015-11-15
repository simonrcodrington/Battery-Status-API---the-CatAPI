  <?php

/*
 * Battery API Class - Single
 * Uses the parent classs to fetch a single image from the CATAPI and return it
 * This page will be called directly with Ajax (and in turn will retrun a single element)
 */
 
//load the parent class
$directory = dirname(__FILE__);
require($directory . '/battery_api_class.php');

//create a new class based on parent class
class battery_api_call extends battery_api{
	
	public function __construct(){
		
		//build arguments for the api
		$arguments = array(
			'format'		      	=> 'xml',
			'results_per_page'	=> 1,
			'type'			      	=> 'jpg',
			'size'				      => 'small'
		);
		
		//determine what method to use
		$method = '/api/images/get?';
		
		//collect images by calling our API function
		$images = $this->get_image_items($method, $arguments);
		
		//return json encoded result (so that it can be manipuldated on the front end)
		echo json_encode($images);
	}
	
}
$battery_call_example = new battery_api_call;
?>