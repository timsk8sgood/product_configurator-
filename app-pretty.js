const version = '1.12.1';
var uid = config.model_id;
var iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
let api;
let materialToChange;
let uprights;
let crossmembers;
let accent;
const width = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
const height = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;

//////////////////////////////////
// touch device display
//////////////////////////////////
function isMobile() {
    return "ontouchstart" in window;
}
if (isMobile()) {
    console.log("is mobile");

    document.querySelector('#logo').style.display = 'none';
    document.querySelector('#menu-colapse').style.display = 'none';
    document.querySelector("body").style.paddingBottom = 'calc(1em + env(safe-area-inset-bottom))';
}
else {
    console.log("is not mobile");
}
//////////////////////////////////
// touch device display
//////////////////////////////////

//////////////////////////////////
// Color Math Code
//////////////////////////////////

const GAMMA = 2.4;

function srgbToLinear1(c) {
    var v = 0.0;
    if (c < 0.04045) {
        if (c >= 0.0) v = c * (1.0 / 12.92);
    } else {
        v = Math.pow((c + 0.055) * (1.0 / 1.055), GAMMA);
    }
    return v;
}

function srgbToLinear(c, out) {
    var col = out || new Array(c.length);

    if (c.length > 2 && c.length < 5) {
        col[0] = srgbToLinear1(c[0]);
        col[1] = srgbToLinear1(c[1]);
        col[2] = srgbToLinear1(c[2]);
        if (col.length > 3 && c.length > 3) col[3] = c[3];
    } else {
        throw new Error('Invalid color. Expected 3 or 4 components, but got ' + c.length);
    }
    return col;
}

function hexToRgb(hexColor) {
    var m = hexColor.match(/^#([0-9a-f]{6})$/i);
    if (m) {
        return [
            parseInt(m[1].substr(0, 2), 16) / 255,
            parseInt(m[1].substr(2, 2), 16) / 255,
            parseInt(m[1].substr(4, 2), 16) / 255
        ];
    } else {
        throw new Error('Invalid color: ' + hexColor);
    }
}

//////////////////////////////////
// End Color Math Code
//////////////////////////////////

function setColor_uprights(hexColor) {
    var parsedColor = srgbToLinear(hexToRgb(hexColor));
    uprights.channels.AlbedoPBR.enable = true;
    uprights.channels.AlbedoPBR.color = parsedColor;
    materialToChange = uprights;
    api.setMaterial(materialToChange, function () {
        console.log('Color set to ' + hexColor);
    });
}
function setColor_crossmembers(hexColor) {
    var parsedColor = srgbToLinear(hexToRgb(hexColor));
    crossmembers.channels.AlbedoPBR.enable = true;
    crossmembers.channels.AlbedoPBR.color = parsedColor;
    materialToChange = crossmembers;
    api.setMaterial(materialToChange, function () {
        console.log('Color set to ' + hexColor);
    });
}
function setColor_accents(hexColor) {
    var parsedColor = srgbToLinear(hexToRgb(hexColor));
    accent.channels.AlbedoPBR.enable = true;
    accent.channels.AlbedoPBR.color = parsedColor;
    materialToChange = accent;
    api.setMaterial(materialToChange, function () {
        console.log('Color set to ' + hexColor);
    });
}

var error = function () {
    console.error('Sketchfab API error');
};

var success = function (apiClient) {
    api = apiClient;
    api.start();
    api.addEventListener('viewerready', function () {
        console.log('3D Customizer ready');
        // export controls
        document.getElementById('done_div').innerHTML += `<a href="${config.product_link}" class="btn-done">done</a>`;
        document.getElementById('screenshot').innerHTML = '<span class="screenshot_btn material-symbols-outlined">file_upload</span>';
        window.setInterval(function () {
            api.getScreenShot(1000, 800, 'image/png', function (err, result) {
                document.getElementById('screenshot').innerHTML = '';
                var anchor = document.createElement('a');
                anchor.href = result;
                anchor.download = 'your ' + config.product_name + '.jpg';
                anchor.innerHTML = '<span class="screenshot_btn material-symbols-outlined">file_upload</span>';
                document.getElementById('screenshot').appendChild(anchor);
            });
        }, 5000);

        api.getMaterialList(function (err, materials) {
            uprights = materials[config.col_options[0].material];
            crossmembers = materials[config.col_options[1].material];
            accent = materials[config.col_options[2].material];
        });
        var options0 = document.querySelector("#color_options > div.options > div.options0.option_cl");
        var options1 = document.querySelector("#color_options > div.options > div.options1.option_cl");
        var options2 = document.querySelector("#color_options > div.options > div.options2.option_cl");
        options0.querySelectorAll('input[type="checkbox"]').forEach(e => {
            e.addEventListener('click', () => {
                setColor_uprights(e.value);
            });
        });
        options1.querySelectorAll('input[type="checkbox"]').forEach(e => {
            e.addEventListener('click', () => {
                setColor_crossmembers(e.value);
            });
        });
        options2.querySelectorAll('input[type="checkbox"]').forEach(e => {
            e.addEventListener('click', () => {
                setColor_accents(e.value);
            });
        });

        // package buttons
        const mg_body = document.querySelector("#pack0_b");
        const str_body = document.querySelector("#pack1_b");
        const st_body = document.querySelector("#pack2_b");
        const frame_body = document.querySelector("#pack3_b");
        const mg = document.querySelector("#idcheck0");
        const str = document.querySelector("#idcheck1");
        const st = document.querySelector("#idcheck2");
        const frame = document.querySelector("#idcheck3");

        const black = "#0f0f0f";
        const grey = "#454545";

        function show_hide(show_nodes, hide_nodes){
            for (var i = 0; i < hide_nodes.length; i++) {
                api.hide(hide_nodes[i]);
            }
            for (var i = 0; i < show_nodes.length; i++) {
                api.show(show_nodes[i]);
            }
        };
        show_hide(config.packages[0].show_nodes, config.packages[0].hide_nodes);
        mg.addEventListener('click', () => {
            show_hide(config.packages[0].show_nodes, config.packages[0].hide_nodes);
            mg_body.style.backgroundColor = grey;
            str_body.style.backgroundColor = black;
            st_body.style.backgroundColor = black;
            frame_body.style.backgroundColor = black;
        }
        );
        str.addEventListener('click', () => {
            show_hide(config.packages[1].show_nodes, config.packages[1].hide_nodes);
            mg_body.style.backgroundColor = black;
            str_body.style.backgroundColor = grey;
            st_body.style.backgroundColor = black;
            frame_body.style.backgroundColor = black;
        }
        );
        st.addEventListener('click', () => {
            show_hide(config.packages[2].show_nodes, config.packages[2].hide_nodes);
            mg_body.style.backgroundColor = black;
            str_body.style.backgroundColor = black;
            st_body.style.backgroundColor = grey;
            frame_body.style.backgroundColor = black;
        }
        );
        frame.addEventListener('click', () => {
            show_hide(config.packages[3].show_nodes, config.packages[3].hide_nodes);
            mg_body.style.backgroundColor = black;
            str_body.style.backgroundColor = black;
            st_body.style.backgroundColor = black;
            frame_body.style.backgroundColor = grey;
        }
        );

        // menu collapse
        const exp_btn = document.querySelector("#expand");
        const col_btn = document.querySelector("#collapse");
        const disclaimer = document.querySelector("#disclaimer");
        const controls = document.querySelector('#controls');
        col_btn.addEventListener('click', () => {
            iframe.style.height = "100vh";
            controls.style.display = 'none';
            disclaimer.style.display = "none";
            col_btn.style.display = "none";
            exp_btn.style.display = "block";
        }
        );

        exp_btn.addEventListener('click', () => {
            if (width >= 1200) {
                disclaimer.style.display = "block";
                iframe.style.height = "75vh";
                controls.style.height = "25vh";
            }
            else {
                disclaimer.style.display = "block";
                iframe.style.height = "65vh";
                controls.style.height = "35vh";
            }
            controls.style.display = 'flex';
            exp_btn.style.display = "none";
            col_btn.style.display = "block";
        }
        );
    });
};


client.init(uid, {
    annotation: 0, // Usage: Setting to [1 – 100] will automatically load that annotation when the viewer starts.
    annotations_visible: 1, // Usage: Setting to 0 will hide annotations by default.
    autospin: 0, // Usage: Setting to any other number will cause the model to automatically spin around the z-axis after loading.
    autostart: 1, // Usage: Setting to 1 will make the model load immediately once the page is ready, rather than waiting for a user to click the Play button.
    cardboard: 0, // Usage: Start the viewer in stereoscopic VR Mode built for Google Cardboard and similar devices.
    camera: 1, // Usage: Setting to 0 will skip the initial animation that occurs when a model is loaded, and immediately show the model in its default position.
    ui_stop: 0, // Usage: Setting to 0 will hide the "Disable Viewer" button in the top right so that users cannot stop the 3D render once it is started.
    transparent: 0, // Usage: Setting to 1 will make the model's background transparent
    ui_animations: 0, // Usage: Setting to 0 will hide the animation menu and timeline.
    ui_annotations: 0, // Usage: Setting to 0 will hide the Annotation menu.
    ui_controls: 0, // Usage: Setting to 0 will hide all the viewer controls at the bottom of the viewer (Help, Settings, Inspector, VR, Fullscreen, Annotations, and Animations).
    ui_fullscreen: 0, // Usage: Setting to 0 will hide the Fullscreen button.
    ui_general_controls: 0, // Usage: Setting to 0 will hide main control buttons in the bottom right of the viewer (Help, Settings, Inspector, VR, Fullscreen).
    ui_help: 1, // Usage: Setting to 0 will hide the Help button.
    ui_hint: 1, // Usage: Setting to 0 will always hide the viewer hint animation ("click & hold to rotate"). Setting to 1 will show the hint the first time per browser session (using a cookie). Setting to 2 will always show the hint.
    ui_infos: 0, // Usage: Setting to 0 will hide the model info bar at the top of the viewer.
    ui_inspector: 0, // Usage: Setting to 0 will hide the inspector button.
    ui_settings: 0, // Usage: Setting to 0 will hide the Settings button.
    ui_vr: 0, // Usage: Setting to 0 will hide the View in VR button.
    ui_watermark_link: 0, // Usage: Setting to 0 remove the link from the Sketchfab logo watermark.
    ui_color: 'cc2026', // Usage: Setting to a hexidecimal color code (without the #) or a HTML color name will change the color of the viewer loading bar.
    ui_watermark: 0, // Usage: Setting to 0 remove the Sketchfab logo watermark.

    success: success,
    error: error
});

//////////////////////////////////
// GUI Code
//////////////////////////////////
function initGui() {
    var color_option = document.getElementById('color_options');
    var insert_text = '';
    insert_text = `
  <div class="color_nav">
    <span class="material-symbols-outlined" id="prev">
      chevron_left
    </span>
    <div id="title_counter">
      <div class="title" id="title">
        <h2>${config.col_options[0].name}</h2>
      </div>
      <div class="counter" id="counter">
        <p>1/3</p>
      </div>
    </div>
    <span class="material-symbols-outlined" id="next">
      chevron_right
    </span>
  </div>
  <div class="options"></div>`;
    color_option.innerHTML = insert_text;
    var options = document.querySelector("#color_options > div.options");
    insert_text = '';
    for (var i = 0; i < config.col_options.length; i++) {
        insert_text += `<div class="options${i} option_cl">`;
        insert_text += `<div class="swatches">`;
        for (var j = 0; j < config.col_options[i].colors.length; j++) {
            insert_text += `
          <label for="myCheck${i}${j}" style="background-color: ${config.col_options[i].colors[j]};" class="color_swatch"">
              <div>
                  <input id="myCheck${i}${j}" type="checkbox" value="${config.col_options[i].colors[j]}"/>
              </div>
          </label>
    `;
        }
        insert_text += '</div></div></div>';
    };
    options.innerHTML = insert_text;

    var packs = document.getElementById('packages');
    packs.innerHTML += `<h2>select package</h2> <div class="sub_packs">`;
    var sub_packs = document.querySelector("#packages > div");
    for (var i = 0; i < config.packages.length; i++) {
        sub_packs.innerHTML += `
      <label for="idcheck${i}">
          <div id="pack${i}_b" class="pack_block">
              <p> ${config.packages[i].name}</p>
              <input id="idcheck${i}" type="checkbox" value="${config.packages[i].name}">
          </div>
      </label>`;
    };
    insert_text = `</div>`;

    packs.innerHTML += `</div>`;
    if (isMobile()) {
        color_option.innerHTML += `
    <div class="disclaimer" id="disclaimer" style="text-align: center; margin: 0;">
      <p>color options are not 100% accurate</p>
    </div>
    `;
    }
    else {
        packs.innerHTML += `
    <div class="disclaimer" id="disclaimer">
      <p>color options are not 100% accurate</p>
    </div>
    `;
    }
}
initGui();

// color options nav
var current = 1;
var next_btn = document.querySelector('#next');
next_btn.addEventListener('click', () => {
    current += 1;
    if (current > 3) {
        current = 1;
    }
    var counter = document.getElementById('counter');
    counter.innerHTML = `<div class="counter" id="counter"><p>${current}/3</p></div>`;

    const first = document.querySelector("#color_options > div.options > div.options0.option_cl");
    const second = document.querySelector("#color_options > div.options > div.options1.option_cl");
    const third = document.querySelector("#color_options > div.options > div.options2.option_cl");
    const title = document.querySelector("#title");
    if (current === 1) {
        title.innerHTML = `<h2>${config.col_options[0].name}</h2>`;
        first.style.display = "block";
        second.style.display = "none";
        third.style.display = "none";
    }
    else if (current === 2) {
        title.innerHTML = `<h2>${config.col_options[1].name}</h2>`;
        first.style.display = "none";
        second.style.display = "block";
        third.style.display = "none";
    }
    else if (current === 3) {
        title.innerHTML = `<h2>${config.col_options[2].name}</h2>`;
        first.style.display = "none";
        second.style.display = "none";
        third.style.display = "block";
    }
});

const prev_btn = document.querySelector("#prev");
prev_btn.addEventListener('click', () => {
    current -= 1;
    if (current < 1) {
        current = 3;
    }
    var counter = document.getElementById('counter');
    counter.innerHTML = `<div class="counter"id="counter"><p>${current}/3</p></div>`;

    const first = document.querySelector("#color_options > div.options > div.options0.option_cl");
    const second = document.querySelector("#color_options > div.options > div.options1.option_cl");
    const third = document.querySelector("#color_options > div.options > div.options2.option_cl");
    const title = document.querySelector("#title");
    if (current === 1) {
        title.innerHTML = `<h2>${config.col_options[0].name}</h2>`;
        first.style.display = "block";
        second.style.display = "none";
        third.style.display = "none";
    }
    else if (current === 2) {
        title.innerHTML = `<h2>${config.col_options[1].name}</h2>`;
        first.style.display = "none";
        second.style.display = "block";
        third.style.display = "none";
    }
    else if (current === 3) {
        title.innerHTML = `<h2>${config.col_options[2].name}</h2>`;
        first.style.display = "none";
        second.style.display = "none";
        third.style.display = "block";
    }
});
//////////////////////////////////
// GUI Code end
//////////////////////////////////

