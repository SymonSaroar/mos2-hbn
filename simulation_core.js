let epsilon = [
    //            Mo      S      B      N
    //            1       2      3      4
    // meV
    [0, 0, 0, 0, 0],
/*Mo*/[0, 0, 0, 58.73, 72.56],
/*S */[0, 0, 0, 15.79, 19.51],
/*B */[0, 58.73, 15.79, 0, 0],
/*N */[0, 72.56, 19.51, 0, 0]
]
let sigma = [
    //       Mo      S      B      N
    //       1       2      3      4
    // A
    [0, 0, 0, 0, 0],
/*Mo*/[0, 0, 0, 3.002, 2.958],
/*S */[0, 0, 0, 3.411, 3.367],
/*B */[0, 3.002, 3.411, 0, 0],
/*N */[0, 2.958, 3.367, 0, 0]
]


let mos2_atom_types = [1, 2];
let hbn_atom_types = [3, 4]
let HBN_bilayer_interlayer_distance = 3.34
let HBN_layers = 2
let mos2_layers = 1
let mos2_bilayer_interlayer_distance = 3
let mos2_atom_type
let hbn_atom_type
function summation_part() {
    let internalEnergy = 0
    let iter = 0
    let ext = [0, 0]
    for(let mos2_layer = 1; mos2_layer <= mos2_layers; mos2_layer++){
        for (i in amos2.atoms) {
            // AB stacking - different type for different layer
            if(mos2_layer & 1){
                if (amos2.atoms[i].type == mos2_atom_types[1]) iter = 2, ext = [1, -1], mos2_atom_type = mos2_atom_types[1]
                else iter = 1, ext = [0, 0], mos2_atom_type = mos2_atom_types[0]
            }
            else{
                if (amos2.atoms[i].type == mos2_atom_types[1]) iter = 1, ext = [0, 0], mos2_atom_type = mos2_atom_types[0]
                else iter = 2, ext = [1, -1], mos2_atom_type = mos2_atom_types[1]
            }
            while (iter--) {
                // Multilayer-HBN
                for (let layer = 1; layer <= HBN_layers; layer++) {
                    for (j in ahbn.atoms) {
                        // console.log(distance(amos2.atoms[i], ahbn.atoms[j]))
                        // console.log(sigma[amos2.atoms[i].type][ahbn.atoms[j].type], distance(amos2.atoms[i], ahbn.atoms[j], ext[iter]))
                        // AA Stacking - same type for both layer
                        if(layer & 1){
                            if(ahbn.atoms[j].type == hbn_atom_types[0]) hbn_atom_type = hbn_atom_types[0]
                            else hbn_atom_type = hbn_atom_types[1]
                        }
                        else{
                            if(ahbn.atoms[j].type == hbn_atom_types[0]) hbn_atom_type = hbn_atom_types[0]
                            else hbn_atom_type = hbn_atom_types[1]
                        }

                        internalEnergy += 4 * epsilon[mos2_atom_type][hbn_atom_type] * (
                            pow(sigma[mos2_atom_type][hbn_atom_type] / distance(
                                                                                            amos2.atoms[i],
                                                                                            ahbn.atoms[j],
                                                                                            ext[iter],
                                                                                            layer),
                                12) -
                            pow(sigma[mos2_atom_type][hbn_atom_type] / distance(
                                                                                            amos2.atoms[i],
                                                                                            ahbn.atoms[j],
                                                                                            ext[iter],
                                                                                            layer),
                                6)
                        )
                    }
                }
            }
        }
    }
    // console.log(cnt)
    return internalEnergy
}

function distance(a, b, ext = 0, layer) {
    // console.log(ext)
    let h = h_slider.value() + ext * distance_between_S / 2 + (layer - 1) * HBN_bilayer_interlayer_distance

    let linear = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)
    linear /= multiplier * multiplier
    // console.log(linear)
    return (sqrt(linear + h * h))
}
