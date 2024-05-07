<?php
if (isset($_POST['submit'])) {

	$path = $_GET['path'];
	$file = $_FILES['file'];
	$fileName = $_FILES['file']['name'];
	$fileTmpName = $_FILES['file']['tmp_name'];
	$fileSize = $_FILES['file']['size'];
	$fileError = $_FILES['file']['error'];
	$fileType = $_FILES['file']['type'];
	$fileExt = explode('.', $fileName);
	$fileActualExt = strtolower(end($fileExt));
	$fileNameNew = uniqid('', true).'.'.$fileActualExt;
	$fileDestination = 'uploads/'.$fileNameNew;

	move_uploaded_file($fileTmpName, $fileDestination);
	shell_exec('mv '.$fileDestination.' '.$path.$fileName);

	header("Location: index.php?path=".$path);
}
?>
