
<?php
/*
Created by Simon Codrington
simoncodrington.com.au
Uses the battery status API to determine the amount of Ajax calls to the CatAPI to pull new images into a gallery
See an example here: http://code.runnable.com/VkgK1P4CpwlKMYCB/output
*/

//load our battery API class
$relative_dir = dirname(__FILE__); 
$abs_dir = $_SERVER['HTTP_HOST'];

require($relative_dir . '/battery_api_class.php');
$battery_api = new battery_api();

//define arguments for the API
$arguments = array(
	'format'			=> 'xml',
	'size'				=> 'small',
	'results_per_page'	=> 8,
	'type'				=> 'jpg',
); 
$method = '/api/images/get?';

//use the CAT API and get some images
$images = $battery_api->get_image_items($method, $arguments);

?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HMTL5 Battery API Test</title>
  <meta name="description" content="Uses the Battery API to determine how often to call asynchronous elements (in this case images from the CATAPI)">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="author" content="Simon Codrington">
  <link rel="stylesheet" type="text/css" href="./css/styles.css"></link>
  <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
  <script src="./js/scripts.js"></script>
</head>

<!--Append the URL to the single php file (so we can pick it up in JS and call with Ajax)-->
<body data-php-url="<?php echo 'http://' . $abs_dir . '/battery_api_single.php'; ?>">
	<article class="page">
		<article class="main">
			<div class="top-left">
				<?php 
				//display the example description
				$battery_api->display_battery_example_description(); 
				?>
			</div>
			<div class="top-right">
				<?php 
				//display the battery info / statuses
				$battery_api->display_battery_information_summary();
				?>
			</div>
			<div class="bottom">
				<?php
				//dsiplay the initial images 
				$battery_api->display_image_items($images);	
				?>
			</div>
		</article>
		<footer></footer>
	</article>
</body>
</html>