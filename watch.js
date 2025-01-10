
    let Caption="Costa Rica";
    let timezone="UTC-6";
    document.getElementById("caption").innerHTML=Caption;
    function get_timezone() {
        if(timezone!='Local'){
            timezone=(parseInt(timezone.slice(3)));
        }
    }
    get_timezone();

    function calc_deg(rad) { return rad*360/Math.PI/2; }
    function calc_rad(deg) { return deg*2*Math.PI/360; }

    var number_bounds = {
        H: 24,
        M: 60,
        S: 60,
    }
    var tilt_degs = {
        H: -180,
        M: 0,
        S: 0,
    }
    var number_radius = {
        H: 29,
        M: 44,
        S: 45,
    }
    function add_numbers(hand_pref) {
        for (var Ti = 0; Ti < number_bounds[hand_pref]; Ti ++) {
            var number = document.createElement('div');
            number.id = hand_pref + '_num_' + Ti;
            number.className = hand_pref + ' number';
            if (hand_pref == 'M' || hand_pref == 'S') {
                if (Ti % 5 == 0) number.className += ' ' + 'active_level_1';
                // if (Ti % 15 == 0) number.className += ' ' + 'active_level_2';
            }
            number.setAttribute('active', 'false');
            number.innerText = Ti;
            number.style.visibilty = 'hidden';
            document.getElementById('panel').appendChild(number);
        }
        refresh_numbers(hand_pref);
    }
    add_numbers('H');
    add_numbers('M');
    //add_numbers('S');
    function refresh_numbers(hand_pref){
        for(var Ti=0; Ti<number_bounds[hand_pref]; Ti++){
            var h_rad=calc_rad(tilt_degs[hand_pref])+Math.PI/number_bounds[hand_pref]*2*Ti;
            var left_p=50+number_radius[hand_pref]*Math.sin(h_rad);
            var right_p=50-number_radius[hand_pref]*Math.cos(h_rad);
            var number=document.getElementById(hand_pref+'_num_'+Ti);
            number.style.left=left_p+'%';
            number.style.top=right_p+'%';
        }
    }

    document.getElementById("setting").insertAdjacentHTML('beforeend', 
        "<input id='Watch-size' type='number' min='0' max='500' step='1' value="
        + parseInt(getComputedStyle(document.getElementById('watch')).getPropertyValue('--Watch-size')) + "> px Watch-size");
    document.getElementById("Watch-size").addEventListener('change', function(eve) {
        document.getElementById('watch').style.setProperty('--Watch-size', eve.target.value + 'px');
    });
    document.getElementById("setting").insertAdjacentHTML('beforeend', 
        "<input id='Watch-color' type='color' value="
        + getComputedStyle(document.getElementById('watch')).getPropertyValue('--Watch-color') + "> Watch-color");

    document.getElementById("Watch-color").addEventListener('change', function(eve) {
        document.getElementById('watch').style.setProperty('--Watch-color', eve.target.value);
    });

    function add_setting_controls  (hand_pref) {
        document.getElementById("setting").insertAdjacentHTML("beforeend", 
            "<form><fieldset>\
                <legend>" + hand_pref + ":</legend>\
                    <input id=" + hand_pref + '_' + "tilt_deg_input type='number' min='-180' max='180' step='1'>\
                    <input id=" + hand_pref + '_' + "tilt_deg_range type='number' min='-180' max='180' step='1'>\
                    <input id=" + hand_pref + '_' + "tilt_deg_reset type='button' value='RESET' Rvalue=" + tilt_degs[hand_pref] + ">\
                    <input id=" + hand_pref + '_' + "show_number type='checkbox' checked>show number<br>\
                    <input id=" + hand_pref + '_' + "number_radius type='number' min='0' max='50' step='1' value=" + number_radius[hand_pref] + ">number radius\
                    <input id=" + hand_pref + '_' + "hand_width type='number' min='0' max='50' step='0.1' value=" + parseInt(getComputedStyle(document.getElementById('watch')).getPropertyValue('--' + hand_pref + '-hand-width')) + ">width\
                    <input id=" + hand_pref + '_' + "hand_height type='number' min='0' max='50' step='1' value=" + parseInt(getComputedStyle(document.getElementById('watch')).getPropertyValue('--' + hand_pref + '-hand-height')) + ">height\
                    </fieldset></form>");

        function refresh_rot_ctrl(hand_pref) {
            try {
                document.getElementById(hand_pref + '_' + 'tilt_deg_input').value = tilt_degs[hand_pref];
                document.getElementById(hand_pref + '_' + 'tilt_deg_range').value = tilt_degs[hand_pref];
                refresh_numbers(hand_pref);
                clock('ALL');
            }catch(ex) {}
        }
        refresh_rot_ctrl(hand_pref);
        document.getElementById(hand_pref + '_' + 'tilt_deg_input').addEventListener('change', function(eve) {
            tilt_degs[hand_pref] = parseInt(eve.target.value);
            refresh_rot_ctrl(hand_pref);
        });
        document.getElementById(hand_pref + '_' + 'tilt_deg_range').addEventListener('mousemove', function(eve) {
            tilt_degs[hand_pref] = parseInt(eve.target.value);
            refresh_rot_ctrl(hand_pref);
        });
        document.getElementById(hand_pref + '_' + 'tilt_deg_reset').addEventListener('click', function(eve) {
            tilt_degs[hand_pref] = parseInt(eve.target.value);
            refresh_rot_ctrl(hand_pref);
        });
        document.getElementById(hand_pref + '_' + 'show_number').addEventListener('change', function(eve) {
            var myNodelist = document.getElementsByClassName(hand_pref + ' number');
            if (eve.target.checked) {
                for (i = 0; i < myNodelist.length; i++) {
                    myNodelist[i].style.visibilty = 'visible';
                }
            }else {
                for (i = 0; i < myNodelist.length; i++) {
                    myNodelist[i].style.visibilty = 'hidden';
                }
            }
        });
        document.getElementById(hand_pref + '_' + 'show_number').dispatchEvent(new Event('change'));
        document.getElementById(hand_pref + '_' + 'number_radius').addEventListener('change', function(eve) {
            number_radius[hand_pref] = eve.target.value;
            refresh_numbers(hand_pref);
        });
        document.getElementById(hand_pref + '_' + 'hand_width').addEventListener('change', function(eve) {
            document.getElementById('watch').style.setProperty('--' + hand_pref + '-hand-width', eve.target.value + '%');
            clock('ALL');
        });
        document.getElementById(hand_pref + '_' + 'hand_height').addEventListener('change', function(eve) {
            document.getElementById('watch').style.setProperty('--' + hand_pref + '-hand-height', eve.target.value + '%');
            clock('ALL');
        });
    }
    add_setting_controls('H');
    add_setting_controls('M');
    //add_setting_controls('S');
    var active_numbers = {
        H: '',
        M: '',
        S: ''
    }
    function clock(hand_pref) {
        if (hand_pref == 'ALL') { 
            clock('S');
            clock('M');
            clock('H');
            return;
        }
        var time = new Date();
        if(timezone!='Local'){
            // console.log("Local -",time);
            time.setTime(time.getTime() + time.getTimezoneOffset()*60*1000);
            // console.log("UTC 0 -",time);
            time.setTime(time.getTime() + timezone*60*60*1000);
            // console.log("UTC ? -",time);
        }
        var value;
        if (hand_pref == "H") value = time.getHours() + time.getMinutes()/number_bounds['M'];
        else if (hand_pref == "M") value = time.getMinutes() + time.getSeconds()/number_bounds['S'];
        else if (hand_pref == "S") value = time.getSeconds() + time.getMilliseconds()/1000

        var deg = tilt_degs[hand_pref] + value/number_bounds[hand_pref] * 360;
        document.getElementById(hand_pref + '_hand').style.transform = "rotate(" + deg + 'deg)';
        value = parseInt(value);
        if (hand_pref == "S") number_active("S", "M", (value + 1)%number_bounds["S"]);
        else if (hand_pref == "M") number_active("M", "M", value);
        else if (hand_pref == "H") number_active("H", "H", value);
    }
    clock('ALL');

    var myTimer = setInterval(clock, 1*60*1000, 'H');
    var myTimer = setInterval(clock, 1*1000, 'M');
    var myTimer = setInterval(clock, 5*10, 'S');
    function number_active (hand_pref, show_hand_pref, number) {
        if (active_numbers[hand_pref] !== '' && active_numbers[hand_pref] != number) {
            document.getElementById(show_hand_pref + '_num_' + active_numbers[hand_pref]).setAttribute('active', 'false');
        }
        active_numbers[hand_pref] = number;
        document.getElementById(show_hand_pref + '_num_' + active_numbers[hand_pref]).setAttribute('active', 'true');
    }

