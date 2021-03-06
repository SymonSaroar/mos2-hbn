/*
 type:
    1. Molybdenum
    2. Sulfur
*/

function mos2_hex(n, side_length, shape){
    this.n = n
    this.side_length = side_length
    let w = sqrt(3) * side_length
    let h = 2 * side_length

    this.dx = 0.5 * w
    this.dy = 0.25 * h
    this.rotated = 0
    let tempAtoms = []

    this.atoms = []
    
    this.substrate_size = 6 * n
    if(n == 1) this.substrate_size = 6 + 20
    let max_x = -Infinity
    let max_y = -Infinity

    let min_x = +Infinity
    let min_y = +Infinity

    for(let i = 0; i < (this.substrate_size); i++){
        if(i % 3 == 2) continue
        for(let j = 0; j < (this.substrate_size); j++){
            if( (i % 6 == 0 || i % 6 == 4) && j % 2 == 0 ){
                if(i % 6 == 0){
                    temp_postype = [
                        [this.dx * tx_03[0], this.dy * ty_03[0]],
                        [this.dx * tx_03[1], this.dy * ty_03[1]],
                        [this.dx * tx_03[2], this.dy * ty_03[2]]
                    ]
                }
                if(i % 6 == 4){
                    temp_postype = [
                        [this.dx * tx_14[0], this.dy * ty_14[0]],
                        [this.dx * tx_14[1], this.dy * ty_14[1]],
                        [this.dx * tx_14[2], this.dy * ty_14[2]]
                    ]
                }

                // i % 6 = 0, 3    -> Molybdenum
                tempAtoms.push(new molecule(i%6 == 0? 1 : 2, j * this.dx, i * this.dy, temp_postype, side_length))

            }
            else if( (i % 6 == 1 || i % 6 == 3) && j % 2 == 1 ){
                if(i % 6 == 3){
                    temp_postype = [
                        [this.dx * tx_03[0], this.dy * ty_03[0]],
                        [this.dx * tx_03[1], this.dy * ty_03[1]],
                        [this.dx * tx_03[2], this.dy * ty_03[2]]
                    ]
                }
                if(i % 6 == 1){
                    temp_postype = [
                        [this.dx * tx_14[0], this.dy * ty_14[0]],
                        [this.dx * tx_14[1], this.dy * ty_14[1]],
                        [this.dx * tx_14[2], this.dy * ty_14[2]]
                    ]
                }


                // i % 6 = 1, 4    -> Sulfur
                tempAtoms.push(new molecule(i%6 == 1? 2 : 1, j * this.dx, i * this.dy, temp_postype, side_length))
            }
            // max_x = max(max_x, j * this.dx)
            // min_x = min(min_x, j * this.dx)

            // max_y = max(max_y, i * this.dy)
            // min_y = min(min_y, i * this.dy)
        }

    }
    
    // Take a beautiful Hexagoanal shape
    let atm = (2 * n - 1) * floor(this.substrate_size / 2) + floor(this.substrate_size / 4)
    // console.log(atm)
    
    let from = [tempAtoms[atm].x - this.dx, tempAtoms[atm].y + this.dy]
    
    let radius = (1 + 2 * (this.n - 1)) * this.dx + this.dx * 0.2
    
    let radius_squared = radius * radius
    this.center = from

    isEqual = (a, b) => {
        let diff_x = abs(a.x - b.x)
        let diff_y = abs(a.y - b.y)
        // console.log(diff_x, diff_y)
        if(diff_x <= (0.5 * this.dx) && diff_y <= (0.5 * this.dy))
            return true;
        else return false;
    }
    area = (a, b, c) => {
        return Math.abs((a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y-b.y)) / 2.0)
    }
    onSegment = (a, b, c) => {
        if(b.x <= max(a.x, c.x) && b.x >= min(a.x, c.x) && 
            b.y <= max(a.y, c.y) && b.y >= min(a.y, c.y)) return true
        else return false
    }
    checkOrientation = (a, b, c) => {
        let val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
        if(abs(val) <= 1e-2) return 0
        else if(val > 0) return 1
        else return 2
    }
    doIntersect = (a, b, c, d) => {
        let o1 = checkOrientation(a, b, c)
        let o2 = checkOrientation(a, b, d)
        let o3 = checkOrientation(c, d, a)
        let o4 = checkOrientation(c, d, b)

        if(o1 != o2 && o3 != o4) return true

        if(o1 == 0 && onSegment(a, c, b)) return true
        if(o2 == 0 && onSegment(a, d, b)) return true
        if(o3 == 0 && onSegment(c, a, d)) return true
        if(o4 == 0 && onSegment(c, b, d)) return true

        return false
    }
    checkInsidePolygon = (points, p, take_corner) => {
        let len = points.length
        if(len < 3) return false
        ex = {
            x: 1e12,
            y: p.y
        }
        let cnt = 0
        for (j in points){
            if(!take_corner && isEqual(p, points[j])) return false
        }
        for (let j = 0; j < len; j++){
            // console.log("check fo intersection", points[j], points[(j + 1) % len], p, ex)
            if(doIntersect(points[j], points[(j + 1) % len], p, ex)){
                // console.log("intersect", points[j], points[(j + 1) % len], p, ex)
                if(checkOrientation(points[j], p, points[(j + 1) % len]) == 0){
                    // console.log("onSegment", points[j], p, points[(j + 1) % len])
                    return onSegment(points[j], p, points[(j + 1) % len])
                }
                cnt++
            }
        }

        if(cnt % 2 == 0) return false
        else return true
    }
    checkInsideTrinagle = (top, left, right, x) => {
        let A = area(top, left, right)
        let A1 = area(x, left, right)
        let A2 = area(top, x, right)
        let A3 = area(top, left, x)
        let AA = A - A1 - A2 - A3
        // console.log(A, AA)

        if ( abs(AA) <= 1e-1 && !isEqual(x, top) && !isEqual(x, left) && !isEqual(x, right)){
            // console.log("true")
            return true
        }
        else return false
    }
    switch (shape) {
        case 'hex':
            let updown = 2.0 + (n - 1) * 3
            let leftright = n
            let farleft = 2 * n - 1
            this.center = from
            if (n == 1 || n == 2){
                for (i in tempAtoms){
                    if((
                    (tempAtoms[i].x - from[0]) * (tempAtoms[i].x - from[0]) + 
                    (tempAtoms[i].y - from[1]) * (tempAtoms[i].y - from[1])
                    ) <= radius_squared){
                        this.atoms.push(tempAtoms[i])  
                    }
                }
                break;
            }
            else{
                this.poly = [
                    {x: from[0] + leftright * this.dx - 0.25 * this.dx, y: from[1] + updown * this.dy},
                    {x: from[0] + farleft * this.dx + 0.5 * this.dx, y: from[1]},
                    {x: from[0] + leftright * this.dx - 0.25 * this.dx, y: from[1] - updown * this.dy},
                    {x: from[0] - leftright * this.dx + 0.25 * this.dx, y: from[1] - updown * this.dy},
                    {x: from[0] - farleft * this.dx - 0.5 * this.dx, y: from[1]},
                    {x: from[0] - leftright * this.dx + 0.25 * this.dx, y: from[1] + updown * this.dy},
                ]
            }
            for(i in tempAtoms){
                // if((
                //     (tempAtoms[i].x - from[0]) * (tempAtoms[i].x - from[0]) + 
                //     (tempAtoms[i].y - from[1]) * (tempAtoms[i].y - from[1])
                //     ) <= radius_squared){
                //     this.atoms.push(tempAtoms[i])       
                // }
                // this.atoms.push(tempAtoms[i])
                if(checkInsidePolygon(this.poly, tempAtoms[i], true)){
                    this.atoms.push(tempAtoms[i])
                }
            }
            break;
        case 'tri':
            let offset_lf = n + 2
            let offset_up = 2 * offset_lf
            if(n % 3 == 1){
                from[0] += this.dx
                from[1] -= this.dy
            }
            else if(n % 3 == 2){
                from[0] += this.dx
                from[1] += this.dy
            }
            this.center = from
            this.poly = [{
                    x: from[0],
                    y: from[1] - this.dy * offset_up
                },{
                    x: from[0] - this.dx * offset_lf,
                    y: from[1] + this.dy * offset_lf
                },{
                    x: from[0] + this.dx * offset_lf,
                    y: from[1] + this.dy * offset_lf
            }]

            for (i in tempAtoms){
                // console.log(i, tempAtoms[i])
                if(checkInsidePolygon(this.poly, tempAtoms[i], false)){
                    // console.log("i " + i)
                    // console.log(i, tempAtoms[i])
                    this.atoms.push(tempAtoms[i])
                    // console.log(this.atoms)
                }
            }
            break;
        
        default:
            this.atoms = tempAtoms
            break;
    }

    // tempAtoms = []

    // Translate evrything to its center (of Gravity)
    for(i in this.atoms){
        this.atoms[i].x -= this.center[0]
        this.atoms[i].y -= this.center[1]

        for(j in this.atoms[i].neighbours){
            this.atoms[i].neighbours[j][0] -= this.center[0]
            this.atoms[i].neighbours[j][1] -= this.center[1]
        }
    }
    this.drawShape = function(){
        noFill()
        strokeWeight(2)
        beginShape()
        for (i in this.poly){
            vertex(this.poly[i].x - this.center[0], this.poly[i].y - this.center[1])
        }
        endShape(CLOSE)
    }

    // console.log(this.atoms)
    this.rotate = function(angle, pt = [0, 0]){

        this.rotated += angle

        angle = -angle
        let s = sin(angle)
        let c = cos(angle)
        let newx, newy
        for(i in this.atoms){
            newx = (this.atoms[i].x - pt[0]) * c - (this.atoms[i].y - pt[1]) * s
            newy = (this.atoms[i].x - pt[0]) * s + (this.atoms[i].y - pt[1]) * c
            this.atoms[i].x = newx + pt[0]
            this.atoms[i].y = newy + pt[1]
            for(j in this.atoms[i].neighbours){
                newx = (this.atoms[i].neighbours[j][0] - pt[0]) * c - (this.atoms[i].neighbours[j][1] - pt[1]) * s
                newy = (this.atoms[i].neighbours[j][0] - pt[0]) * s + (this.atoms[i].neighbours[j][1] - pt[1]) * c
                this.atoms[i].neighbours[j][0] = newx + pt[0]
                this.atoms[i].neighbours[j][1] = newy + pt[1]
            }
        }
    }

    this.unrotate = function(pt){
        this.rotate(-this.rotated, pt)
    }

    this.rotate_with = function(angle, pt){
        this.unrotate(pt)
        this.rotate(angle, pt)
    }

    this.show = function(){
        // circle(0, 0, radius * 2)
        for(i in this.atoms){
            // console.log(this.atoms[i].x, this.atoms[i].y)
            this.atoms[i].show(this.side_length)
        }
        
    }
    
}
