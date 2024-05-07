<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" href="style.css">
<meta charset="UTF-8>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>file explorer</title>
</head>
<body>
<div class="login-window-wrapper"><div class="login-window window outset">
	<div class="blue-bar"></div>
	<br>
	Type a user name and password to log on to Windows:<br><br>
	<form action="index.php">
		username: <input type="text" class="text-input" name="username" style="position: absolute; left: 100px"><br><br>
		password: <input type="text" class="text-input" name="password" style="position: absolute; left: 100px"><br><br>
		<button type="submit" name="submit" class="outset">Ok</button>
		<input type="hidden" name="path" value="/">
	</form>
</div></div>
</body>
