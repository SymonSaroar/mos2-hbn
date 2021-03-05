let silder_padding = 300
let text_padding = 10
let seperator = 25
let value_padding = 525
let min_sum_val = +Infinity
let min_sum_h = 0
let min_sum_x = -Infinity
let min_sum_y = -Infinity

let auto_trac_on = false
let auto_rotate_on = false
let auto_lateral_on = false
let input_field
function create_elements(){
    // n slider  
    n_slider_text = createP("<b>n = </b>")
    n_slider_text.position(text_padding, height + 10)
    n_slider_text.style('color', 'green')
    n_slider = createSlider(1, 16, 2, 1)
    n_slider.style('width', '200px')
    n_slider.position(silder_padding, height + seperator)
    n_slider_value_text = createP("" + n_slider.value())
    n_slider_value_text.style('color', 'orange')
    n_slider_value_text.position(value_padding, height + 10)
    n_slider_value_text.mouseOver(take_n_input)

    // h slider
    h_slider = createSlider(0, 10, 4.8, 1e-5)
    h_slider_text = createP("<b>h (Inter-layer Distance) = </b>")
    h_slider.position(silder_padding, height + seperator * 2)
    h_slider_text.position(text_padding, height + 10 + seperator)
    h_slider.style('width', '200px')
    h_slider_text.style('color', 'green')
    h_slider_value_text = createP("" + h_slider.value())
    h_slider_value_text.style('color', 'orange')
    h_slider_value_text.position(value_padding, height + 10 + seperator)
    h_slider_value_text.mouseOver(take_h_input)
}

function internal_energy(){
    // Internal Energy
    internal_energy_text = createP("Internal Energy = " + summation_part())
    internal_energy_text.position(silder_padding, height + 10 + seperator * 2)
    internal_energy_text.style('color', 'orange')
    internal_energy_text.style('font-family', "Fira Code")
}
function minimum_internal_energy(){
    // Trac Minimum
    minimum_internal_energy_text = createP("Minimum = ")
    minimum_internal_energy_text.position(silder_padding, height + 10 + seperator * 3)
    minimum_internal_energy_text.style('font-family', "Fira Code")
    minimum_internal_energy_text.mousePressed(() => h_slider.value(min_sum_h))

    reset_minimum_to_current = createImg('icons/reset.png', 'Set Minimum')
    reset_minimum_to_current.position(silder_padding - 25, height + seperator * 4)
    reset_minimum_to_current.style('width', '20px')
    reset_minimum_to_current.mousePressed(() => {min_sum_val = cur_internal_energy})

    auto_trac_button = createImg('icons/play.png', 'Find Auto Start/Pause')
    auto_trac_button.style('width', '20px')
    auto_trac_button.mousePressed(auto_with_precision)
    auto_trac_button.position(silder_padding - 25, height + seperator * 2)
}
function stacking_angle(){
    // Stacking Angle Slider
    theta_slider_text = createP("<b>&#x1d703;</b> = ")
    theta_slider_text.position(text_padding, height + 10 + seperator * 4)
    theta_slider_text.style('color', 'green')
    
    theta_slider = createSlider(0, 120, 0, 0.01)
    theta_slider.position(silder_padding, height + 5*seperator)
    theta_slider.style('width', '200px')
    theta_slider_value_text = createP("" + theta_slider.value())
    theta_slider_value_text.position(value_padding, height + 10 + seperator * 4)
    theta_slider_value_text.style('color', 'orange')
    theta_slider_value_text.mouseOver(take_theta_input)

    auto_rotate_button = createImg('icons/play.png', "Auto rotate")
    auto_rotate_button.style('width', '20px')
    auto_rotate_button.mousePressed(rotate_with_precision)
    auto_rotate_button.position(silder_padding - 25, height + seperator * 5)
}

function precision_controller(){
    precision_slider = createSlider(-10, 10, 1, 0.01)
    precision_slider.style('width', '400px')
    precision_slider.position(width - precision_slider.width * 0.35, 20 + precision_slider.width / 2)
    precision_slider.style('transform', 'rotate(-90deg)')

    precision_slider_value_text = createP("" + precision_slider.value())
    precision_slider_value_text.position(width + 57, 25 + precision_slider.width)
    precision_slider_value_text.style('color', 'red')
    precision_slider_value_text.style('font-size', '1.5em')
    precision_slider_value_text.mouseOver(take_precition_input)
}
function lateral_x(){
    x_slider = createSlider(-35, 35, -2, 1)
    x_slider.style('width', '200px')
    x_slider.position(silder_padding, height + 6 * seperator)

    auto_lateral_button = createImg('icons/play.png', "auto Lateral")
    auto_lateral_button.style('width', '20px')
    auto_lateral_button.mousePressed(move_hbn)
    auto_lateral_button.position(silder_padding - 25, height + seperator * 6)

}
function lateral_y(){
    y_slider = createSlider(-52, 52, -2, 1)
    y_slider.style('width', '200px')
    y_slider.position(silder_padding, height + 7 * seperator)

}
function one_time_button(){
    make_circle_button = createButton('HBN circle toggle', 'one')
    make_circle_button.position(width + 40, height - 20)
    make_circle_button.mousePressed(hbn_circle)
}



function checkbox(){
    show_checkbox = createCheckbox('Show', true)
    show_checkbox.changed(changeAnimaton)
    show_checkbox.position(width + 20, height - 20)
}

function hbn_circle(){
    ahbn.make_circle(16)
    make_circle_button.mousePressed(reset_hbn)
}
function reset_hbn(){
    ahbn.reset()
    make_circle_button.mousePressed(hbn_circle)
}
function changeAnimaton(){
    if(show_checkbox.checked()) showAnim = true
    else if(!show_checkbox.checked()) showAnim = false
}
function plotter_texts(){
    axis_x_texts = [0, 60, 120]
    axis_y_texts = [min_sum_val - 100, min_sum_val + 200]
    
    axis_x_text = []
    for(i in axis_x_texts){
        
    }
}

function take_n_input(){
    if(input_field != null) input_field.remove()
    input_field = createInput("" + n_slider.value())
    input_field.position(value_padding, height + 22.5)
    input_field.changed(()=>{
        n_slider.value(input_field.value())
        input_field.remove()
    })
    input_field.mouseOut(() => {input_field.remove()})
}
function take_h_input(){
    if(input_field != null) input_field.remove()
    input_field = createInput("" + h_slider.value())
    input_field.position(value_padding, height + 22.5 + seperator)
    input_field.changed(()=>{
        h_slider.value(input_field.value())
        input_field.remove()
    })
    input_field.mouseOut(() => {input_field.remove()})
}
function take_theta_input(){
    if(input_field != null) input_field.remove()
    input_field = createInput("" + theta_slider.value())
    input_field.position(value_padding, height + 22.5 + seperator * 4)
    input_field.changed(() => {
        theta_slider.value(input_field.value())
        input_field.remove()
    })
    input_field.mouseOut(() => {input_field.remove()})
}
function take_precition_input(){
    if(input_field != null) input_field.remove()
    input_field = createInput("" + precision_slider.value())
    input_field.position(precision_slider_value_text.x, 22.5 + precision_slider_value_text.y)
    input_field.style('font-size', '1.5em')
    input_field.changed(() => {
        precision_slider.value(input_field.value())
        input_field.remove()
    })
    input_field.mouseOut(() => {input_field.remove()})
}

function update_dom_texts(){
    let h_val = h_slider.value()
    let x_val = x_slider.value()
    let y_val = y_slider.value()
    let sum_val = summation_part()
    let theta_val = theta_slider.value()

    cur_internal_energy = sum_val
    cur_theta = theta_val
    
    internal_energy_text.html("Internal Energy = " + sum_val)
    if(sum_val <= min_sum_val){
        min_sum_val = sum_val
        min_sum_h = h_val
        min_sum_theta = theta_val
        min_sum_x = x_val
        min_sum_y = y_val
        minimum_internal_energy_text.style('font-weight', 'normal')
        minimum_internal_energy_text.style('color', 'red')
    }
    else{
        minimum_internal_energy_text.style('font-weight', 'bold')
        minimum_internal_energy_text.style('color', 'magenta')
    }
    if(min_sum_h == 0) minimum_internal_energy_text.html("Undefined")
    else minimum_internal_energy_text.html(`Minimum = (${min_sum_h}, ${min_sum_theta}, [${min_sum_x}, ${min_sum_y}]) -> ${min_sum_val}`)


    // Update If automated
    if(auto_trac_on)
        h_slider.value(h_slider.value() + 0.0001 * precision_slider.value() * 100)
    if(auto_rotate_on)
        theta_slider.value(theta_slider.value() + 0.01 * precision_slider.value() * 10)
    
    if(auto_lateral_on){
        if(x_slider.value() == x_slider.elt.max && y_slider.value() == y_slider.elt.max){
            h_slider.value(h_slider.value() + 0.01 * precision_slider.value())
            x_slider.value(x_slider.elt.min)
            y_slider.value(y_slider.elt.min)
        }
        else if(y_slider.value() == y_slider.elt.max){
            x_slider.value(x_slider.value() + 1 * precision_slider.value())
            y_slider.value(y_slider.elt.min)
        }
        else
            y_slider.value(y_slider.value() + 1 * precision_slider.value())
    }

    n_slider_value_text.html("" + n_slider.value())
    h_slider_value_text.html("" + h_slider.value())
    theta_slider_value_text.html("" + theta_slider.value())
    precision_slider_value_text.html("" + precision_slider.value())

}

function auto_with_precision(){
    auto_trac_on = true
    auto_trac_button.mousePressed(stop_auto)
    auto_trac_button.elt.src = "icons/pause.png"
}
function stop_auto(){
    auto_trac_on = false
    auto_trac_button.mousePressed(auto_with_precision)
    auto_trac_button.elt.src = "icons/play.png"
}

function rotate_with_precision(){
    auto_rotate_on = true
    auto_rotate_button.mousePressed(stop_auto_rotate)
    auto_rotate_button.elt.src = "icons/pause.png"
}

function stop_auto_rotate(){
    auto_rotate_on = false
    auto_rotate_button.mousePressed(rotate_with_precision)
    auto_rotate_button.elt.src = "icons/play.png"
}
function move_hbn(){
    auto_lateral_on = true
    auto_lateral_button.mousePressed(stop_moving_hbn)
    auto_lateral_button.elt.src = "icons/pause.png"
}
function stop_moving_hbn(){
    auto_lateral_on = false
    auto_lateral_button.mousePressed(move_hbn)
    auto_lateral_button.elt.src = "icons/play.png"
}