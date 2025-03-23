
$(document).ready(function(){

    var dir = 2;

    /*
    document.onkeydown = function(e){
        if (
            e.keyCode <=40 &&
            e.keyCode >= 37 &&
            !(e.keyCode == 37 && dir == 2) &&
            !(e.keyCode == 39 && dir == 0) &&
            !(e.keyCode == 38 && dir == 3) &&
            !(e.keyCode == 40 && dir == 1)
        ) dir = e.keyCode - 37;
    }
    */

    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");

    const cell_size = 32;
    const line_width = 0.75;

    const size_x = 50;
    const size_y = 24;

    canvas.height = size_y * cell_size;
    canvas.width = size_x * cell_size;

    snake = [[0, 0]];
    var head_index = 0;

    var apple_x = 2;
    var apple_y = 2;

    alive = true;

    requestAnimationFrame(function Update(){

        var x = parseInt(snake[head_index][0]); //update snake
        var y = parseInt(snake[head_index][1]);

        head_index++;
        if (head_index == snake.length){head_index = 0;}
        
        switch(dir){
            case 0:
                x--;
                break;
            case 1:
                y--;
                break;
            case 2:
                x++;
                break;
            case 3:
                y++;
                break;
        }

        if (x == apple_x && y == apple_y){
            snake.splice(head_index, 0, [x, y]);
            var valid_positions = size_x * size_y - snake.length;
            if (valid_positions == 0){apple_x = NaN; apple_y = NaN}
            else {
                var index = Math.floor(Math.random()*valid_positions)
                var i = -1;
                for (var j = 0; j < size_x * size_y; j++){
                    var valid_position = true;
                    for (var segment of snake){
                        if (segment[0] + size_x * segment[1] == j) valid_position = false;
                    }
                    if (valid_position) i++;
                    if (i == index){
                        apple_x = j % size_x;
                        apple_y = Math.floor(j / size_x);
                        break;
                    }
                }
            }
        } else {
            snake[head_index]=[x, y];
        }

        for (var i = 0; i < snake.length; i++){
            if (i != head_index){
                var segment = snake[i];
                if (segment[0] == x && segment[1] == y) alive = false;
            }
        }

        if (x < 0 || x >= size_x || y < 0 || y >= size_y){
            alive = false;
        }


        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas

        if (alive) ctx.strokeStyle = "red"; //draw snake
        else ctx.strokeStyle = "orange";

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = cell_size * line_width;
        ctx.beginPath();
        ctx.moveTo((snake[head_index][0] + 0.5) * cell_size, (snake[head_index][1] + 0.5) * cell_size);
        for (var i = snake.length; i > 0; i--){
            var index = (i + head_index + snake.length) % snake.length;
            ctx.lineTo((snake[index][0] + 0.5) * cell_size, (snake[index][1] + 0.5) * cell_size);
        }

        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "green"; //draw apple

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc((apple_x + 0.5) * cell_size, (apple_y + 0.5) * cell_size, cell_size * line_width/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();



        if (alive) setTimeout(()=>requestAnimationFrame(Update), 20);

        // AI

        var tile = (x + y) % 2;
        if (dir == 1 || dir == 3) tile = 1 - tile;

        if (tile == 0) dir_0 = (dir + 3)%4;  //turn direction
        else dir_0 = (dir + 5)%4;
        dir_1 = dir;                         //straight direction

        // check dir_0

        var x = snake[head_index][0];
        var y = snake[head_index][1];

        switch(dir_0){
            case 0:
                x--;
                break;
            case 1:
                y--;
                break;
            case 2:
                x++;
                break;
            case 3:
                y++;
                break;
        }

        var check_0 = 1;

        if ( // check if apple would be nearer
            Math.abs(x - apple_x) < Math.abs(snake[head_index][0] - apple_x) ||
            Math.abs(y - apple_y) < Math.abs(snake[head_index][1] - apple_y)
            ) check_0 = 2;



        for (var i = 0; i < snake.length; i++){ // check if snake would be dead (overrides apple)
            if (i != head_index && i != (head_index + 1) % snake.length){
                var segment = snake[i];
                if (segment[0] == x && segment[1] == y) check_0 = 0;
            }
        }

        if (x < 0 || x >= size_x || y < 0 || y >= size_y){
            check_0 = 0;
        }

        // check dir_1

        var x = snake[head_index][0];
        var y = snake[head_index][1];

        switch(dir_1){
            case 0:
                x--;
                break;
            case 1:
                y--;
                break;
            case 2:
                x++;
                break;
            case 3:
                y++;
                break;
        }

        var check_1 = 1;

        if ( // check if apple would be nearer
            Math.abs(x - apple_x) < Math.abs(snake[head_index][0] - apple_x) ||
            Math.abs(y - apple_y) < Math.abs(snake[head_index][1] - apple_y)
            ) check_1 = 2;



        for (var i = 0; i < snake.length; i++){ // check if snake would be dead (overrides apple)
            if (i != head_index && i != (head_index + 1) % snake.length){
                var segment = snake[i];
                if (segment[0] == x && segment[1] == y) check_1 = 0;
            }
        }

        if (x < 0 || x >= size_x || y < 0 || y >= size_y){
            check_1 = 0;
        }

        if (check_1 < check_0) dir = dir_0
        else dir = dir_1
    });
})