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

let distance_between_S = 3.01
let HBN_bilayer_interlayer_distance = 3.34
let HBN_layers = 2
function summation_part() {
    let internalEnergy = 0
    let iter = 0
    let ext = [0, 0]
    for (i in amos2.atoms) {
        if (amos2.atoms[i].type == 2) iter = 2, ext = [1, -1]
        else iter = 1
        while (iter--) {
            // Multilayer-HBN
            for (let layer = 1; layer <= HBN_layers; layer++) {
                for (j in ahbn.atoms) {
                    // console.log(distance(amos2.atoms[i], ahbn.atoms[j]))
                    // console.log(sigma[amos2.atoms[i].type][ahbn.atoms[j].type], distance(amos2.atoms[i], ahbn.atoms[j], ext[iter]))
                    internalEnergy += 4 * epsilon[amos2.atoms[i].type][ahbn.atoms[j].type] * (
                        pow(sigma[amos2.atoms[i].type][ahbn.atoms[j].type] / distance(
                                                                                        amos2.atoms[i],
                                                                                        ahbn.atoms[j],
                                                                                        ext[iter],
                                                                                        layer),
                            12) -
                        pow(sigma[amos2.atoms[i].type][ahbn.atoms[j].type] / distance(
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
