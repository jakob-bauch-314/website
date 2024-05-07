<?php
$downloadPath = $_GET['downloadPath'];
$path = $_GET['path'];
$fileName = basename($downloadPath);
$fileExt = end(explode('.', $fileName));

function dir_is_empty($dirName){
	foreach (scandir($dirName) as $file){
		if (!in_array($file, array('.', '..', '.svn', '.git'))) return false;
	}
	return true;
}

if (is_file($downloadPath)){	
	$fileNameNew = uniqid('', true).'.'.$fileExt;
	$fileDest = 'downloads/'.$fileNameNew;
	$downloadName = $fileName;
	shell_exec('cp '.$downloadPath.' '.$fileDest);
}

else if (is_dir($downloadPath)){
	if (dir_is_empty($downloadPath)){
		header('Location: index.php?path='.$path);
	};
	$fileExt = 'zip';
	$fileNameNew = uniqid('', true).'.'.$fileExt;
	$fileDest = 'downloads/'.$fileNameNew;
	$downloadName = $fileName.'.zip';
	shell_exec('(cd '.$downloadPath.' && zip -r '.__DIR__.'/'.$fileDest.' .)');
}

else {
	exit();
}

header('Content-Disposition: attachment; filename='.$downloadName);
if(strtolower($fileExt) == 'txt'){header('Content-Type: text/plain');}
else {header('Content-Type: application/'.$fileExt);}

$fp = fopen($fileDest, 'r');
fpassthru($fp);
fclose($fp);

shell_exec('rm '.$fileDest);
?>
