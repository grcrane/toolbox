<?php

/* Get all data and return as json file 
   11/04/2022 - add video_map.csv file */

if(file_exists('gallery2.csv')) {
	$gallery = array_map('str_getcsv', file('gallery2.csv'));
}
else {
	$gallery = [['Folder/Full' => ['Folder','Full',
	'Thumb','Show','People']]]; 
}

if(file_exists('folders2.csv')) {
	$folders = array_map('str_getcsv', file('folders2.csv'));
}
else {
	$folders = [['Folder' =>['Folder','Label',
	'Type','Date','Location','Description']]];
}

if(file_exists('video_map.csv')) {
	$videos = array_map('str_getcsv', file('video_map.csv'));
}
else {
	$videos = [['Video' =>['ID','YouTube',
	'Description']]];
}

$base = getcwd(); 

$settings = [
	'baseURI' => $base,
	'gallercsv' => $base . '/gallery2.csv', 
	'folderscsv' => $base . '/folders2.csv', 
	'logcsv' => $base .'/logfile.csv'
	];

$new = [
	'gallery' => $gallery, 
	'folders' => $folders, 
	'settings' => $settings,
	'video' => $videos
	];
	
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
echo json_encode($new);

?>