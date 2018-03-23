import bootStrap from "./css/bootstrap.min.css";
import css from "./css/index.css";
import {render_animate} from "./js/renderer_handler";
import {WFG_txt_to_G_lp} from "./js/WFG_handler";

render_animate();

function handleFileSelect(evt) {
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.onload = (f) => {
        WFG_txt_to_G_lp(f.target.result);
    };
    reader.readAsText(file);
}

document.getElementById('file_input').addEventListener('change', handleFileSelect, false);
