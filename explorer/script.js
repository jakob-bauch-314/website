
getFile = document.getElementById("getFile");
selectedFile = document.getElementById("selected-file");
submit = document.getElementById("submit");
selectForm = document.getElementById("select-form");

//upload logic

function selectButton() {
	getFile.click();
}

function uploadButton(){
	var file_path = getFile.value;
	var file = getFile.files[0];
	var file_size = file.size;

	if (file_size < 5000000) submit.click();
	else if (file_size < 1000000000000){
		const CHUNK_SIZE = 1000000;
		let start = 0;
		let end = CHUNK_SIZE;
		let chunks = [];
		let file = getFile.files[0];

		selectForm.reset();
		selectedFile.innerHTML = "no file selected";

		while (start < file_size){
			let chunk = file.slice(start, end);
			chunks.push(chunk);
			start = end;
			end = start + CHUNK_SIZE;
		}

		chunks.forEach((chunk, index) => {

			let formData = new FormData();
			formData.append('file', chunk);
			formData.append('name', file.name);
			formData.append('index', index);

			fetch('chunk_upload.php', {
				method: 'POST',
				body: formData,
			}).then(response => {
				console.log(response);
			}).catch(error => {
				console.log(error);
			});
		})

		return;
	}
}

getFile.addEventListener("change", function(e){
	if (e.target.files[0]){
		path = getFile.value;
		selectedFile.innerHTML = "<nobr>  " + path + "</nobr>";
	}
});

// context menue

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
	document.getElementById("context-menu").style.display = "none";
}

function rightClick(e) {
	target = e.target.parentElement;
	if (target.classList.contains("file-item") && target.getAttribute("data-selected") == "true"){
		e.preventDefault();
		if (document.getElementById("context-menu").style.display == "block") {
			hideMenu();
		} else {
			var menu = document.getElementById("context-menu");
			var download_link = document.getElementById("download");
			var delete_link = document.getElementById("delete");

			download_link.setAttribute(
				"href", "download.php?downloadPath=" + target.getAttribute("data-path") + "&path=" + path
			);
			delete_link.setAttribute(
				"href", "delete.php?deletePath=" + target.getAttribute("data-path") + "&path=" + path
			);

			menu.style.display = "block";
			menu.style.left = e.pageX + "px";
			menu.style.top = e.pageY + "px";
		}
	}
}

// menue bar

function make_dir(){
	var file_table = document.getElementById("file-table").getElementsByTagName("tbody")[0];
	var new_folder = `
		<tr class="file-item">
		<td class="file name" data-path="/home/files"><nobr>
			<img src="images/folder.png" class="icon">
			<form action="mkdir.php" method="get">
				<input type="text" name="folderName" id="new_folder" class="renamed-file" value="New_Folder"></input>
				<input type="hidden" name="path" value="${path}">
				<button type="submit" id="folder_submit" style="display: none"></button>
			</form>
		</nobr></td>
		<td class="file size"><nobr></nobr></td>
		<td class="file type">Folder<nobr></nobr></td>
	`;
	file_table.innerHTML += new_folder;
	new_folder = document.getElementById('new_folder');
	folder_submit = document.getElementById('folder_submit');
	new_folder.select();

	new_folder.addEventListener("focusout", function(e){folder_submit.click()});
}

//files

function file_single_click(element){
	switch(element.getAttribute("data-selected")){
		case "true":
			element.setAttribute("data-selected", "false");
			break;
		case "false":
			console.log(document.getElementsByClassName("file-item"));
			Array.from(document.getElementsByClassName("file-item")).forEach(function(file, i){
				file.setAttribute("data-selected", "false");
			});
			element.setAttribute("data-selected", "true");
			break;
	}
	//switch(element.getAttribute("data-selected")){
	//	case "true":
	//		element.setAttribute("data-selected", "false");
	//		break;
	//	case "false":
	//		element.setAttribute("data-selected", "true");
	//		break;
	//}
}

function file_double_click(element){
	if (element.getAttribute("data-readable") == "true"){
		document.location = "index.php?path=" + element.getAttribute("data-path") + "/";
	} else {
		alert("folder is not readable");
	}
}

function file_clicked(event, element){
	switch(event.detail){
		case 1:
			timer = setTimeout(() => {
				file_single_click(element);
			}, 200);
			break;
		case 2:
			clearTimeout(timer);
			file_double_click(element);
			break;
	}
}
