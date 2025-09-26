const apiKey = "AIzaSyD2o-BxB-FFgemeELBomU6qM5BUX1jwfLg";
let lang_menu_vis = false
function lang_menu(){
    if(lang_menu_vis){
        document.getElementById("lang-menu").style.display = "none"
    }else{
        document.getElementById("lang-menu").style.display = "flex"

    }
    lang_menu_vis = !lang_menu_vis
}
// Function to collect all text nodes on the page
function getTextNodes() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT; // ignore empty
                if (node.parentNode && ["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.parentNode.nodeName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    let nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }
    return nodes;
}

// Translate text via Google API
async function translateText(texts, targetLang) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            q: texts,
            target: targetLang
        }),
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data.data.translations.map(t => t.translatedText);
}

// Replace texts in DOM
async function translatePage(targetLang) {
    const nodes = getTextNodes();
    const originalTexts = nodes.map(n => n.nodeValue);

    // Split into chunks if needed (API has char limit per request)
    const translated = await translateText(originalTexts, targetLang);

    // Replace one by one
    nodes.forEach((node, i) => {
        node.nodeValue = translated[i];
    });
}