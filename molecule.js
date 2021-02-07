function molecule(type, x, y, posType, side_length)
{
    let mul = side_length * 2 / 30;
    this.type = type;
    this.x = x;
    this.y = y;
    
    this.neighbours = []

    for(i in posType){
        this.neighbours.push(
            [
                this.x + posType[i][0],
                this.y + posType[i][1]
            ])
    }
    // console.log(this.neighbours)
    switch (this.type) {
        case 1:
            this.diameter = 7 * mul
            this.color = [73, 17, 145]
            break;
        case 2:
            this.diameter = 7 * mul
            this.color = [201, 207, 37]
            break;
        case 3:
            this.diameter = 4 * mul
            this.color = [50, 148, 15]
            break;
        case 4:
            this.diameter = 4 * mul
            this.color = [200, 200, 200]
            break;
        default:
            this.diameter = 3 * mul
            this.color = [0, 0, 0]
            break;
    }

    this.show = function(side_length){
        strokeWeight(0.2)
        fill(this.color)
        // console.log(this.type, this.x, this.y, this.diameter)
        circle(this.x, this.y, this.diameter)


        // Draw Bonds
        strokeWeight(this.diameter * 0.25)
        stroke(this.color)
        for(i in this.neighbours){
            mid_x = (this.x + this.neighbours[i][0]) / 2
            mid_y = (this.y + this.neighbours[i][1]) / 2

            line(this.x, this.y, mid_x, mid_y)
        }
        
    }
}