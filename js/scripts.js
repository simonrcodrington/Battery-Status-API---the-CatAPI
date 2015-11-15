   /*
 * Battery API Scripts
 * Handles the functionality and work with the battery API!
 */

jQuery(document).ready(function($){
	
	
	var battery; //the battery object itself
	var battery_support; //if we supports the battery API
	var battery_level; //current battery level (out of 100)
	var battery_is_charging ; //is the device currently charging
	var battery_status; //status of battery (use this state to determine other actions)
		
	var api_action_interval_item; //the variable which will hold the API action
	var api_action_counter_item; //the variable used to count the time between API intervals
	
	var api_action_interval_time; //the time we will execute the item
	var api_action_counter_time; //the time we will update the counter
	
	
	//called to retreive the battery object (and to start off our functionality)
	function battery_start(){
		
		//Check for support of either navigator.getBattery or navigator.battery
		if(navigator.getBattery || navigator.battery){
	
			//check for support of the new getBattery method (which uses a promise)
			if(navigator.getBattery){
				navigator.getBattery().then(function(battery_obj){
					
					battery = battery_obj;
					update_status_information();
					display_status_information();
					battery_event_handlers();
					start_ajax_api_task();
				});	
			}
			//else use the old navigator.battery to get it directly
			else{
				
				battery = navigator.battery;
				update_status_information();
				display_status_information();
				battery_event_handlers();
				start_ajax_api_task();
			}
		}
		//No support for the battery api at all
		else{		
			battery = false;
			update_status_information();
			display_status_information();
			start_ajax_api_task();
		}
	}
	battery_start();
	
	//get the current support for the battery
	function get_battery_support(){
		
		if(battery){
			battery_support = true;
		}else{
			battery_support = false;
		}
	}

	//gets the current level of the battery
	function get_battery_level(){
		
		if(battery_support){
			battery_level = (battery.level * 100);
		}else{
			battery_level = false;
		}
	}
	
		
	//gets the status of the battery (determines which state to applly which affects functionality)
	function get_battery_status(){
	
		//if we have battery support, determine status
		if(battery_support){
			
			//high level
			if(battery_level >= 70 && battery_level <= 100){
				battery_status = 'high';
			}
			//medium level
			else if(battery_level >= 30 && battery_level < 70){
				battery_status = 'medium';
			}
			//low level
			else if(battery_level >= 10 && battery_level < 30){
				battery_status = 'low';
			}
			//critical level
			else if(battery_level < 10){
				battery_status = 'critical';
			}
		}
		//no battery support, status is 
		else{
			battery_status = 'no_support';
		}
		
	
	}
	
	//gets the status of the device if we are charging
	function get_battery_charging(){
		
		if(battery_support){
			if(battery.charging == true){
				battery_is_charging = true;
			}else{
				battery_is_charging = false;
			}
		}
	}
	
	//gets the time that we will execute our AJAX call (based on battery state)
	function get_api_action_interval(){
		
		//if we have battery support
		if(battery_support){
			//determine the request interval that our action will occur
			if(battery_status == 'high'){
				api_action_interval_time = 3000;
			}else if(battery_status == 'medium'){
				api_action_interval_time = 5000;
			}else if(battery_status == 'low'){
				api_action_interval_time = 8000;
			}else if(battery_status == 'critical'){
				api_action_interval_time = false;
			}
		}
		//no battery support (run our task normally)
		else{
			if(battery_status == 'no_support'){
				api_action_interval_time = 3000;
			}
		}	
	}
	
	//sets the time that we will update the display counter 
	//(shows how many seconds until the next Ajax call)
	function get_api_counter_interval(){
		api_action_counter_time = 100;
	}

	//sets the background based on the level of the battery
	function set_background_colour(){
		
		var battery_class = '';
		if(battery_status == 'high'){
			battery_class = 'high-battery';
		}else if(battery_status == 'medium'){
			battery_class = 'medium-battery';
		}else if(battery_status == 'low'){
			battery_class = 'low-battery';
		}else if(battery_status == 'critical'){
			battery_class = 'critical-battery';
		}
		
		$('html').removeClass();
		$('html').addClass(battery_class);
	}
	
		
	//updates the status information about the device (charge level etc)
	function update_status_information(){
		
		//determine info about the battery and our api calls
		get_battery_support();
		get_battery_level();
		get_battery_status(); 
		get_battery_charging()
		set_background_colour();
		get_api_action_interval();
		get_api_counter_interval();

	}

	//changes the display information
	function display_status_information(){
		
		//Display battery specific information (if we support it)
		if(battery_support == true){
			$('.battery-info .support-title').html('<h3 class="has-support">Your device supports the Battery API!</h3>');
			$('.battery-info .supports span').html(String(battery_support));
			$('.battery-info .battery-level span').html(String(battery_level + '%'));
			$('.battery-info .battery-charging span').html(String(battery_is_charging));
			$('.battery-info .call-interval span').html(String(api_action_interval_time));
		}
		//no support for the API, list only what we can
		else{
			$('.battery-info .support-title').html('<h3 class="no-support">Your device does not support the Battery API</h3>');
			$('.battery-info .supports span').html('No Battery API Support');
			$('.battery-info .battery-level span').html('No Battery Level Known');
			$('.battery-info .battery-charging span').html('No Charging Status Known');
			$('.battery-info .call-interval span').html(String(api_action_interval_time));
			$('.battery-info .simulate-container').hide();
		}
	}


	//adds event handlers (for the various states and actions of the battery)
	function battery_event_handlers(){
		
		//update the charging status when device stops or starts charging
		battery.addEventListener('chargingchange', function(){
			
			//get the charging status and update the information
			get_battery_charging();
			display_status_information();
			
		});
			
		//update the battery level when the device changes its level
		battery.addEventListener('levelchange', function(){
			
			//as the level changes we need to update our information, display it and then restart our ajax task
			update_status_information();
			display_status_information();
			start_ajax_api_task();
		});
			
	}

	//gets a new image from the API and replaces a curent gallery image
	function replace_grid_image(){
		
		//determine if we are currently viewing the page
		hidden = (typeof document.hidden !== 'undefined' ? document.hidden : false); 
		
		if(!hidden){
			
			//get the URL of the PHP file we will be calling
			$url = $('body').attr('data-php-url'); 
			
			console.log('url is: ' + $url);
			
			$.ajax({
				url: $url,
				cache: false,
			  type: "POST",
				success: function(data){
					for(var key in data){
						//collect our image info
						var $image_id = data[key].id;
						var $source_url = data[key].source_url;
						var $url = data[key].url;
						
						//append the image to the dom
						var image = '';
						image += '<img class="inactive" src="' + $url + '"/>';

						//find a random element from our grid
						var gallery_items = $('.gallery-grid').find('.gallery-item');		
						var random_val = Math.floor(Math.random() * gallery_items.length); 
						var item = gallery_items.eq(random_val); 
						
						//add our new image
						item.find('img:last-child').after(image)
						
						//find the newly added image after we have loaded
						item.find('img.inactive').one("load",function(){
							
							//add the active class and remove all other sibling images
							$(this).addClass('active');
							$(this).removeClass('inactive');
						});
					}
					
				},
				dataType: 'json'
			});
		}
		
	}

	//main functionality, pulls an image from the CATAPI depending on your battery info
	function start_ajax_api_task(){
	
		//clear any used interval variables
		clearInterval(api_action_interval_item);
		clearInterval(api_action_counter_item);

		//device is in critical state, no auto updates
		if(battery_status == 'critical'){
			$('.battery-info .next-call span').html('Manual Updates Only');
			//display manual refresh button
			$('.load-button').show();
		}
		//battery is in a good state, run task
		else{
			
			//main task, replace an image every x seconds
			api_action_interval_item = setInterval(function(){	
				replace_grid_image();
			}, api_action_interval_time);
			
			//secondary task, shows a counter for the user to display when the next update will happen
			var counter= 0;
			api_action_counter_item = setInterval(function(){
				
				counter += api_action_counter_time;
				$('.battery-info .next-call span').html(((api_action_interval_time - counter) / 1000) + ' seconds'); 
				
				//if counter is > interval, reset and track the next update
				if(counter >= api_action_interval_time){
					counter = 0;
				}
			},api_action_counter_time);
			
			//make sure the manual fetch button is hidden;
			$('.load-button').hide();	
		}
	}
	
		
	
	//BATTERY SIMULATION
	//Activated when we click on one of the battery level simulation buttons
	$('.button.simulate-level').on('click',function(){
		
		$(this).siblings('.simulate-level').removeClass('active');
		$(this).addClass('active');
		var simulate_state = $(this).attr('data-simulate-state');

		//Manually set the battery level to force the system to the set value
		//high state
		if(simulate_state == 'high'){
			battery_level = 100;
		}
		//medium state
		else if(simulate_state == 'medium'){
			battery_level = 69;
		}
		//low state
		else if(simulate_state == 'low'){
			battery_level = 29;
		}
		//critical state
		else if(simulate_state == 'critical'){
			battery_level = 9;
		}
		
	
		//update status, colour and request interval
		get_battery_status(); 
		set_background_colour();
		get_api_action_interval();
		start_ajax_api_task();
		
		//update the display information
		display_status_information();
	});

	//MANUAL load image button
	$('.load-button').on('click', replace_grid_image);
	
	
});




