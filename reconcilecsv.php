<?php 

/*----------------------------------------*/
/*           Reconcile CSV files          */
/*----------------------------------------*/

/* Change log

  09/11/2022 (9:50pm) - Update parent firstthumb if it doesn't have one 
     - this could occur if the parent did not have any direct
     - children images. 
  09/20/2022 (8:32am) - More cleanup 
  09/23/2022 (12:11pm) - Clean up firstthumb processing
  10/08/2022 - Add mp4 file types
*/

function doReconcile($base) {
  global $foldarr, $filearr;
  global $fileCount, $folderCount;
  global $firstthumb;

  // V1.0 09/10/22
  // Renamed reconcilecsv.php

  $cc = 0; 
  $tt = 0; 
  $ff = 0;

  $matcharr = []; 
  $folderCount = 0;
  $fileCount = 0;
  $newfiles = 0; 
  $foldarr = [];
  $filearr = [];
  $firstthumb = [];

  //$base = '/Users/george/Sites/CCLA_Photos'; 

  $errors = [];
  // Define a function to output files in a directory
  // https://www.tutorialrepublic.com/php-tutorial/php-parsing-directories.php
  function outputFiles($base, $path){
      global $cc, $tt, $ff, $filearr, $foldarr, $errors, $matcharr;
      global $folderCount, $fileCount;

      $allowedExtensions = array('jpg','png','jpeg','mp4');
      $ignoreFolders = array('temp','thumb');

      // Check directory exists or not
      $folderpath = $base . $path;

      if(file_exists($folderpath) && is_dir($folderpath)){
          
          // Scan the files in this directory
          $result = scandir($folderpath);
        

          $ff++;
          // Filter out the current (.) and parent (..) directories
          $files = array_diff($result, array('.', '..'));
          $comparedate = strtotime("-10 days");

          if(count($files) > 0){
              // Loop through retuned array
              foreach($files as $file){
                  if(is_file("$folderpath/$file") and $path != '/temp'){

                      // Display filename
                      $basename = basename($folderpath);
                      $filetype = pathinfo($folderpath . '/' . $file, PATHINFO_EXTENSION);
                      if ($basename != 'thumb' and 
                          in_array(strtolower($filetype),$allowedExtensions)) {
                          $thumb = $file;
                          $pathInfo = pathinfo($thumb);
                          if ($pathInfo['extension'] == 'mp4') {
                            $thumb = $pathInfo['filename'] . '.jpg';
                          }
                          
                          if (!file_exists($folderpath . '/thumb/' . $thumb)) {
                              $tt++; 
                          }
                          else {
                              $thumb = 'thumb/' . $thumb;
                              //$filetime = filemtime($folderpath . '/thumb/' . $file);
                              //if ($filetime < $comparedate) {
                              //  $thumb = $file;
                              //}
                          }
                          $cc++; 
                          $filearr[trim($path,'/') . $file] = [trim($path,'/'),$file,$file, $thumb,'Y'];
                          $key = trim($path,'/');
                          $pathinfo = pathinfo($key);
                        
                          if ($key) { // ignore this
                            $fileCount++; 
                          }
                      }
                  } else if(is_dir("$folderpath/$file")){
                      // Recursively call the function if directories found
                      if ($file != 'thumb' and $path != '') {
                          $cc = count($foldarr);
                          $temp = explode("/",trim($path,'/') . '/'); 
                          $pathinfo = pathinfo(trim($path . '/' . $file,'/'));         
                          $foldarr[trim($path . '/' . $file,'/')] = [trim($path . '/' . $file,'/'),
                            str_replace("_"," ",$temp[1]), $temp[0],'','',$file,''];
                          $folderCount++; 
                          
                      }
                      outputFiles($base,"$path/$file");
                  }
              }
          } else{
              $errors['nofiles'][] = "ERROR: No files found in the directory (" . $folderpath . ").";
          }
      } else {
          $errors['nodir'][] = "ERROR: The directory does not exist.";
      }

  }
  
  // Start things out and call the function to gather directories and files 
  outputFiles($base, '');

  // Reconcile the gallery photos

  if(file_exists($base . '/gallery2.csv')){
      $gallery = array_map('str_getcsv', file($base . '/gallery2.csv'));
      array_shift($gallery);
      
      foreach($gallery as $key => $file) {
  
          $pathInfo = pathinfo($file[1]);
          $thumb = $file[1];
          if ($pathInfo['extension'] == 'mp4') {
            $thumb = 'thumb/' . $pathInfo['filename'] .  '.jpg';
            
          }
          $keyval = $file[0] . $thumb ;
          if (!isset($firstthumb[$file[0]])) {
            $firstthumb[$file[0]] = $thumb;
          }
          if (isset($filearr[$keyval])) {
              $gallery[$key][2] = $filearr[$keyval][2]; // in case the thumb changed
              $gallery[$key][3] = $filearr[$keyval][3]; // in case the thumb changed
              unset($filearr[$keyval]); // delete from foldarr

          }
          else {
              $gallery[$key][0] = ''; // mark as deleted 
          }  
      }
      // whats left in foldarr is to be added to $folders and saved. 
    
      foreach($filearr as $file) {
          $gallery[] = $file;
      }
  }
  else {
    $gallery = $filearr; 
  }
 
  $head = array('Folder','image','Full','Thumb','Show','People');
  array_unshift($gallery , $head);
  $fp = fopen($base . '/gallery2.csv', 'w');
  foreach ($gallery as $fields) {
      if ($fields[0] != '' or $fields[0] == null) {
          fputcsv($fp, $fields);
      }
  }
  fclose($fp);

  

  // Reconcile the folders csv file

  if(file_exists($base . '/folders2.csv')){
      $folders = array_map('str_getcsv', file($base . '/folders2.csv'));
      echo "<pre>";
      echo print_r($folders);
      echo "<pre>";
      foreach($folders as $key => $file) {

          $keyval = $file[0];
          echo "<br>" . $keyval;
          if (isset($firstthumb[$file[0]])) {
            $folders[$key][6] = $firstthumb[$file[0]];
          }
          else {
            // If this folder doesn't have any images, then ignore it
            $folders[$key][0] = '';
          }
          if (isset($foldarr[$keyval])) {
            echo "<br>deleting";
            unset($foldarr[$keyval]); // delete from foldarr
          }
          else {
            // If the folder no longer exists then ignore it
            $folders[$key][0] = ''; // mark as deleted 
          }  
      }
      // whats left in foldarr is to be added to $folders and saved. 

    
      foreach($foldarr as $file) {
          $folders[] = $file;
      }
  }
  else {
    $folders = $foldarr; 
  }

  

  $head = array('Folder','Label','Type','Date','Location','Description','thumb');
  array_unshift($folders , $head);
  $fp = fopen($base . '/folders2.csv', 'w');

  $folderCount = 0; 
  foreach ($folders as $key =>  $fields) { 
   
      if (isset($firstthumb[$fields[0]])) {
        $fields[6] = $firstthumb[$fields[0]];
      }
      if ($fields[1] == '') {
        $temp = explode("/",trim($fields[0],'/') . '/'); 
        $fields[1] = str_replace("_"," ",$temp[1]);
      }
      if ($fields[6] != '' && $fields[0] != '') {
          $folderCount++;
          fputcsv($fp, $fields);
      }
  }
  fclose($fp);

  $count = 0;
  $total = 0; 
  $fp = fopen($base . '/makethumb.txt', 'w');
  foreach ($gallery as $key => $fields) {
    if ($fields[0] != '' and $key > 1 and $fields[2] == $fields[3]) {
      if ($count < 400) {
        $item = $fields[0] . '/' . $fields[1] . "\n";
        $count++;
        fwrite($fp, $item);
      }
      $total++;
    }
  }
  fclose($fp);

  echo "<p>Reconcile done:";
  echo "<br>Path: " . $base;
  echo "<br>Folders found: " . $folderCount;
  echo "<br>Files found: " . $fileCount; 
  echo "<br>total needing new thumbs: " . $total;

  return;

}

doReconcile(getcwd());
?>