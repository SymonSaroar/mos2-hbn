let plotSketch = function(p){
    let minimum = +Infinity
    let maximum = -Infinity
    let data = []
    p.setup = function(){
        plotCanvas = p.createCanvas(600, 200)
        plotCanvas.position(silder_padding, H + seperator * 8, 'fixed')
        fx = (_) => map(_, -60, 60, 0, p.width)
        fy = (_) => {
			if(_ > maximum + 100)
				return p.height
            else return map(_, minimum - 100, maximum + 100, 0, p.height)
		}
		let resetImage = createImg('icons/reset.png', "Reset Plot")
		resetImage.position(silder_padding - 40, H + seperator * 8)
		resetImage.style('width', '35px')
		resetImage.mousePressed(() => p.reset())
		// console.log(fx(5), fy(5))
		
		binSearch = (l, h, b) => {
			let m = Math.floor((l + h) / 2)
			if(l > h) return -1;

			if(data[m].x == b) return m
			else if(data[m].x < b) return binSearch(l + 1, h, b)
			else return binSearch(l, h - 1, b)
		}
    }
    p.draw = function(){
        p.background(255)
		p.strokeWeight(0.5)
		p.fill(0, 0, 0)
        p.line(p.width / 2, p.height, p.width / 2, 0)

		p.strokeWeight(5)
		p.stroke(0, 0, 0)
		p.noFill()
		p.rect(0, 0, p.width, p.height)
        // console.log(data)
		
		let len = data.length
        // console.log(maximum, minimum)
        if(len == 0){
			data.push({x: cur_theta, y: cur_internal_energy})
			minimum = min(minimum, cur_internal_energy)
			maximum = max(maximum, cur_internal_energy)
		}
        else if(abs(data[len - 1].x - cur_theta) > 0.2){
			data.push({x: cur_theta, y: cur_internal_energy})
			minimum = min(minimum, cur_internal_energy)
			maximum = max(maximum, cur_internal_energy)
		}
		len = data.length
		data.sort((a, b) => {
			if(a.x > b.x) return 1
			else if(a.x < b.x) return -1
			else return 0
		})
		let cur_pos = binSearch(0, len-1, cur_theta)
        for(let i = 1; i < len; i++){
            posx = fx(data[i].x)
			posy = fy(data[i].y)
			posx_o = fx(data[i - 1].x)
			posy_o = fy(data[i - 1].y)
            // console.log(posx, posy)
			p.strokeWeight(1)
			p.stroke('rgba(255, 0, 255, 0.5)')
			// p.line(posx, p.height, posx , p.height - posy)
			p.stroke(255, 0, 20)
			p.strokeWeight(3)
			p.line(posx_o, p.height - posy_o, posx, p.height - posy)
		}
		
		p.fill(255, 0, 20)
		if(len > 1 && cur_pos != -1){
			// console.log(data[len - 1].x, data[len - 1].y)
			p.circle(fx(data[cur_pos].x), p.height - fy(data[cur_pos].y), 10)
		}

	}
	
	p.reset = function(){
		data = []
		minimum = +Infinity
		maximum = -Infinity
	}
}