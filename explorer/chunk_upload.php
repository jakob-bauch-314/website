<?php
$tempDir = 'uploads';
$fileName = $_POST['name'];
$fileIndex = $_POST['index'];
$tmpName = "$tempDir/$fileName.part.$fileIndex";

move_uploaded_file($_FILES['file']['tmp_name'], $tmpName);
chmod($tmpName, 0777);

if ($fileIndex < 17) die();

$finalDir = 'uploads';
$filePath = "$tempDir/$fileName.part.*";
$fileParts = glob($filePath);
sort($fileParts, SORT_NATURAL);

$finalFile = fopen("$finalDir/$fileName", 'w');
chmod("$finalDir/$fileName", 0777);

foreach ($fileParts as $filePart) {
    $chunk = file_get_contents($filePart);
    fwrite($finalFile, $chunk);
    unlink($filePart);  // Optionally delete the chunk
}

fclose($finalFile);
?>
