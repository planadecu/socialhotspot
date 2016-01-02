<?php

  $ip = $_SERVER['REMOTE_ADDR'];
  $user = $_POST["user"];

  if($user!=null) file_put_contents("db/users.txt", $user . ", " . $ip . "\n" , FILE_APPEND);

?>

OK