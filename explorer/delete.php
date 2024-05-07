<?php
$deletePath = $_GET['deletePath'];
$path = $_GET['path'];
if (is_file($deletePath)){
	shell_exec('rm '.$deletePath);
}
if (is_dir($deletePath)){
	shell_exec('rmdir '.$deletePath);
}
header('Location: index.php?path='.$path);
?>
