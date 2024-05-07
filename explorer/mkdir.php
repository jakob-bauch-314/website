<?php
$folderName = $_GET['folderName'];
$path = $_GET['path'];
if (is_dir($path)) {
	shell_exec('mkdir '.$path.$folderName);
}
header('Location: index.php?path='.$path);
?>
