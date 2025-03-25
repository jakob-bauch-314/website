
states = []

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const project = urlParams.get('project')

$(document).ready(function(){
    
    $("#title").append(project);
    $("#project").attr("src", `projects/${project}/index.html`);

})