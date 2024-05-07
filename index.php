<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" href="style.css">
<meta charset="UTF-8>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>file explorer</title>
</head>
<body>
hi
<?php
	echo 'hi';
	$password = $_GET['password'];
	echo $password;
	if ($password != 'asdf'){
		echo 'incorrect';
	}
	$path = $_GET['path'];
	if (!is_readable($path)) echo 'permission not granted';
	$selected_file = $_GET['filename'];
	$files = array_diff(scandir($path), array('.', '..'));
	$folder_up = implode('/', array_slice(explode('/', $path), 0, -2)).'/';
	$file_count = count($files);

	function size_string($value){
		if ($value < 1000){return strval($value).' B';}
		if ($value < 1000000){return strval(intdiv($value, 1000)).' KB';}
		if ($value < 1000000000){return strval(intdiv($value, 1000000)).' MB';}
		if ($value < 1000000000000){return strval(intdiv($value, 1000000000)).' GB';}
		return strval(intdiv($value, 1000000000000)).' TB';
	}

	function file_type($filepath){
		$ending = pathinfo($filepath)['extension'];
		$type = strtoupper($ending)." File";
		if ($ending == ''){$type = 'File';}
		if ($ending == 'txt'){$type = 'Text File';}
		return $type;
	}

	function icon($filepath){
		$ending = pathinfo($filepath)['extension'];
		$link = 'images/file.png';
		if ($ending == 'txt'){$link = 'images/text.png';}
		if ($ending == 'png'){$link = 'images/image.png';}
		if ($ending == 'bmp'){$link = 'images/image.png';}
		if ($ending == 'jpg'){$link = 'images/image.png';}
		if ($ending == 'JPEG'){$link = 'images/image.png';}
		if ($ending == 'mp3'){$link = 'images/music.png';}
		if ($ending == 'wav'){$link = 'images/music.png';}
		if ($ending == 'mp4'){$link = 'images/video.png';}
		return '<img src="'.$link.'" class="icon">';
	}
?>

<script type="text/javascript">
	var path = "<?php echo $path ?>";
	var selectedFile = "<?php echo $selected_file ?>";
</script>

<div id="context-menu" class="context-menu outset" style="display:none">
	<ul>
		<li><a href="" id = "download" >Download</a></li>
		<li><a href="" id = "delete" >Delete</a></li>
		<li><a href="" id = "rename">Rename</a></li>
	</ul>
</div>

<div id="explorer" class="explorer outset">

	<div id="top" class="top">
		<div id="blue-bar" class="blue-bar">
			<img src="images/explorer.png" class="icon">
			Exploring - <?php echo $path?>
			<div id="close-button" class="close-button outset"><img src="images/quit.png" class="icon"></div>
		</div>
		<table id="menue-bar" class="menue-bar">
			<td>File<div class="outset"><ul>
				<li>new<div class="outset"><ul>
					<li onclick="make_dir()">Folder</li>
					<li>File</li>
				</ul></li>
			</ul></div></td>

			<td>Edit<div class="outset">

			</div></td>

			<td>View<div class="outset">

			</div></td>

			<td>Tools<div class="outset">

			</div></td>

			<td>Help<div class="outset">

			</div></td>
		</table>
	</div>
	

	<div id="middle" class="middle">

		<table id="toolbar" class="toolbar" cellspacing=0 cellpadding=0><tr><nobr>
			<td><div class="folder-selector-wrapper inset margin"><select id="folder-selector">
				<option>My Computer</option>
			</select></div></td>
			<td>
				<a href="?path=<?php echo $folder_up?>">
				<div id="back-button" class="back-button outset margin"><img src="images/up.png" class="icon"></div></a>
			</td>
			<td>
				<form action="upload.php?path=<?php echo $path?>" id="select-form" class="select-form" method="POST" enctype="multipart/form-data">
					<input type="file" id="getFile" name="file">
					<button type="submit" name="submit" id="submit">upload</button>
				</form>
				<button id="select-button" class="select-button outset margin" onclick="selectButton()">select</button>
			</td>
			<td>
				<div id="selected-file" class="selected-file inset margin"><nobr>no file selected</nobr></div>
			</td>
			<td>
				<button id="upload-button" class="upload-button outset margin" onclick="uploadButton();">
					<img src="images/upload.png">
				</button>
			</td>
		</nobr></tr></table>

		<div id="left" class="left">
			<div class="path inset margin">All Folders</div>
			<div id="files-left" class="files-left margin"></div>
		</div>

		<div id="right" class="right">
			<div class="path inset margin">Contents of <?php echo $path?></div>
			<div id="files-right" class="files-right margin">
			<div id="file-list-right" class="file-list">
				<table class="file-header" cellspacing=0 cellpadding=0>
					<td class="name outset">name</td>
					<td class="size outset">size</td>
					<td class="type outset">type</td>
				</table>
		
				<table id="file-table" class="file-table" cellspacing=0 cellpadding=0>
					<tr id="dummy-file" class="file name"></tr>
				<?php
					foreach($files as $file){
						$new_path = $path.$file;
						$readable = "false";
						if (is_readable($new_path)) $readable = "true";
						$name_content = '-';
						$size_content = '-';
						$type_content = '-';

						if (is_dir($new_path)){
							$name_content='<img src="images/folder.png" class="icon">'.$file;
							$size_content='';
							$type_content='Folder';
						} else {
							$name_content=icon($new_path).$file;
							$size_content=size_string(filesize($new_path));
							$type_content=file_type($new_path);
						}
						echo '
						<tr class="file-item" data-selected="false" data-path="'.$new_path.'" data-readable="'.$readable.'" onclick="file_clicked(event, this)">
						<td class="file name"><nobr>'.$name_content.'</nobr></td>
						<td class="file size"><nobr>'.$size_content.'</nobr></td>
						<td class="file type"><nobr>'.$type_content.'</nobr></td>
						</tr>';
					}
				?></table></div>
			</div>
		</div>
	</div>

	<table id="bottom" class="bottom"><tr>
		<td class="bottom-left"><div class="inset margin"><?php echo $file_count?> object(s)</div></td>
		<td class="bottom-right"><div class="inset margin">-</div></td>
	</tr></table>
</div>

<script src="script.js"></script>
</body>
</html>
