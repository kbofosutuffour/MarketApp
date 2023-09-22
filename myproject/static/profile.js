function sell_history() {
    document.getElementById('sell-history').style.display = "block";
    document.getElementById('saved-posts').style.display = 'none';
    document.getElementById('drafts').style.display = 'none';
}

function saved_posts() {
    document.getElementById('sell-history').style.display = "none";
    document.getElementById('saved-posts').style.display = 'block';
    document.getElementById('drafts').style.display = 'none';}

function drafts() {
    document.getElementById('sell-history').style.display = "none";
    document.getElementById('saved-posts').style.display = 'none';
    document.getElementById('drafts').style.display = 'block';
}

function pressed_sell_history(pressed) {
    if (pressed) {
        document.getElementById('show-sell-history').style.border = "3px solid black";
    } else {
        document.getElementById('show-sell-history').style.border = "none";
        document.getElementById('show-sell-history').style.borderRight = "1px solid gray";
    }
}

function pressed_saved_posts(pressed) {
    if (pressed) {
        document.getElementById('show-saved-posts').style.border = "3px solid black";
    } else {
        document.getElementById('show-saved-posts').style.border = "none";
    }
}

function pressed_drafts(pressed) {
    if (pressed) {
        document.getElementById('show-drafts').style.border = "3px solid black";
    } else {
        document.getElementById('show-drafts').style.border = "none";
        document.getElementById('show-drafts').style.borderLeft = "1px solid gray";

    }
}