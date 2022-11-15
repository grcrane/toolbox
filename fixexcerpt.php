<?php 

/*----------------------------------------*/
/*           fixExcerpt                   */
/*----------------------------------------*/

function validateDate($date, $format = 'Y-m-d'){
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

function fixExcerpt ($base) {

  $folders = []; 
 

  if(file_exists($base . '/folders2.csv')){
      $folders = array_map('str_getcsv', file($base . '/folders2.csv'));
      $fp = fopen($base . '/folders2.csv', 'w');
      foreach ($folders as $key =>  $fields) { 
        $path = pathinfo($fields[0]);
        $excerpt = $path['basename'];
        $eParts = explode(" ",$excerpt,4);
        if (validateDate($eParts[0])) {
          $title = substr($eParts[0],0,7) . " " . $eParts[3];
        }
        else {
          $title = $excerpt;
        }
        echo "<br>" . $title;
        $fields[5] = $title; 
        fputcsv($fp, $fields);
      }
      fclose($fp);
  }

  return; 

}
fixExcerpt(getcwd());

?>