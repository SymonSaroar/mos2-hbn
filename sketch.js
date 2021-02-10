let amos2
let distance_between_S = 3.01
let mos_bond_length = Math.sqrt(2.42 * 2.42 - distance_between_S * distance_between_S / 4)
let bn_bond_length = 1.45
// let HBN_bilayer_interlayer_distance = 3.34
let multiplier = 1
let tx_03 = [0, 1, -1]
let ty_03 = [-2, 1, 1]

let tx_14 = [0, 1, -1]
let ty_14 = [2, -1, -1]

let temp_postype
let old_value = -1
let old_theta_value = -1
let plotCanvas
let n_pos = [0, 3, 3, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4, 3, 3, 4, 4]
let W, H
let cur_internal_energy = 0, cur_theta = 0
let showAnim = true
function setup() {
	createCanvas(600, 600);
	W = width
	H = height
	plotCanvas = new p5(plotSketch)
    angleMode(DEGREES)
    // mos2_hex(n, side_legth)
    // Mo(3n^2) S(6n^2)
    // Mo-S bond length = 2.383
    // on Mo plane .. horizontal component = sqrt(2.383^2 - 3.01^2)
    // B-N bond length = 1.45
    // taking 2.383 as 30
    create_elements()

    amos2 = new mos2_hex(n_slider.value(), multiplier * mos_bond_length, 'hex')
	console.log(amos2.atoms)
	// console.log(old_value)
    // console.log(amos2.atoms)

    // Substrate_Size = 3 * n * n 
    // just to make the work flow.. like MoS2
    ahbn = new hbn_hex(100, multiplier * bn_bond_length, 'hex') // Substrate size = n -> n x n points
    // On which atom? H or N

    internal_energy()
    minimum_internal_energy()
	stacking_angle()
	precision_controller()
	lateral_x()
	lateral_y()
	checkbox()
}

function draw() {
  
	if(old_value != n_slider.value()){
		amos2 = new mos2_hex(n_slider.value(), multiplier * mos_bond_length, 'hex')
		old_value = n_slider.value()
		switch (n_pos[old_value]) {
		case 3:
			ahbn.re_center(-1, 1)
			break;
		case 4:
			ahbn.re_center(-1, -1)
			break;
		default:
			break;
		}

		min_sum_val = +Infinity
		min_sum_h = 0
		plotCanvas.reset()
	}
	ahbn.re_center(x_slider.value(), y_slider.value())
	
	if(old_theta_value != theta_slider.value()){
		amos2.rotate_with(theta_slider.value())
		old_theta_value = theta_slider.value()
	}

	update_dom_texts()
	background(255);
	translate(width / 2, height / 2)

	if(showAnim){
		ahbn.show()
		amos2.show()
	}
	// amos2.drawShape()
}

