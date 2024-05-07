

class Snake{
    constructor(size_x, size_y){
        this.head = new List(
            {x:3, y:0},
            {x:2, y:0},
            {x:1, y:0},
            {x:0, y:0}
        );
        this.alive = true;
        this.size_x = size_x;
        this.size_y = size_y;
        this.apple_x = 8;
        this.apple_y = 8;
        this.dir = 2;
    }
    move(){

        // calculate new head position
        var new_head = new List({x:this.head.value.x, y:this.head.value.y})
        switch(this.dir){
            case 0:
                new_head.value.x--;
                break;
            case 1:
                new_head.value.y--;
                break;
            case 2:
                new_head.value.x++;
                break;
            case 3:
                new_head.value.y++;
                break;
        }

        // attach head to body
        new_head.next = this.head;
        this.head = new_head;

        // check if reached apple
        if (this.head.value.x == this.apple_x && this.head.value.y == this.apple_y) {
            var options = this.size_x * this.size_y - this.head.length();
            if (options == 0){}
            var index = Math.floor(Math.random() * options);
            var i = -1;
            for (var x = 0; x < this.size_x; x++){
                for (var y = 0; y < this.size_y; y++){
                    i++;
                    for(var running_head = this.head; running_head != null; running_head = running_head.next){
                        if (running_head.value.x == x && running_head.value.y == y){
                            i--;
                            break;
                        };
                    }
                    console.log(i, index);
                    if (i == index){
                        this.apple_x = x;
                        this.apple_y = y;
                        return;
                    }
                }
            }
        };

        // remove last element
        this.head.pop(); 

        //check self collision
        for(var running_head = this.head.next; running_head != null; running_head = running_head.next){
            if (running_head.value.x == this.head.value.x && running_head.value.y == this.head.value.y){
                this.alive = false;
                return;
            };
        }

        // check wall collision
        if (
            this.head.value.x < 0 ||
            this.head.value.x >= this.size_x ||
            this.head.value.y < 0 ||
            this.head.value.y >= this.size_y
            ){
                this.alive = false;
            }
    }
}

var snake = new Snake(32, 32);

$(document).ready(function(){

    // setup grid
    const canvas = $("#canvas")[0];
    const grid = new Grid({
        width:      snake.size_x,
        height:     snake.size_y,
        cell_size:  24,
        canvas:     canvas,
        fullscreen: true,
        background_color: "rgba(31, 31, 31, 255)"
    });

    // setup controls
    document.onkeydown = function(e){
        if (
            e.keyCode <=40 &&
            e.keyCode >= 37 &&
            !(e.keyCode == 37 && snake.dir == 2) &&
            !(e.keyCode == 39 && snake.dir == 0) &&
            !(e.keyCode == 38 && snake.dir == 3) &&
            !(e.keyCode == 40 && snake.dir == 1)
        ) snake.dir = e.keyCode - 37;
    }

    grid.redraw = ()=>{
        grid.clear();
        grid.draw_line(snake.head, snake.alive ? "red" : "orange", 0.2);
        grid.draw_circle({x:snake.apple_x, y:snake.apple_y}, "green", 0.2)
    }

    requestAnimationFrame(function Update(){
        snake.move();
        grid.redraw();
        if (snake.alive) setTimeout(Update, 100);
    });
})
