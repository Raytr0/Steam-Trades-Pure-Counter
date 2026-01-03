// ==UserScript==
// @name        TF2 Wallet Counter (Native Text Match)
// @namespace   https://github.com/Raytr0
// @version     1.3
// @author      Raytr0
// @description Counts TF2 currency and embeds it into the trade panel using native styles.
// @include     /^https?:\/\/steamcommunity\.com\/tradeoffer.*/
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const KEY_IDS = ["101785959"]; // Standard Mann Co. Key
    const REF_ID = "2674";         // Refined Metal
    const REC_ID = "5564";         // Reclaimed Metal
    const SCRAP_ID = "2675";       // Scrap Metal

    // --- UI Injection Logic ---
    let displayElement = null;

    function initUI() {
        const controlsDiv = document.getElementById('controls');

        if (controlsDiv && !document.getElementById('tf2_wallet_display')) {

            // 1. Create Wrapper
            // "control_fields" provides the standard margins used by other blocks
            const wrapper = document.createElement('div');
            wrapper.id = 'tf2_wallet_display';
            wrapper.className = 'control_fields';
            wrapper.style.width = '100%';
            wrapper.style.marginBottom = '10px';

            // 2. Create Content Div
            // "selectableNone" makes it match the font/size of "Add multiple items:" exactly
            const content = document.createElement('div');
            content.className = 'selectableNone';

            // We remove specific font-size/family here so it inherits from the class
            content.style.color = '#8F98A0'; // Matches the label text color
            content.style.width = '100%';
            content.innerHTML = 'Scanning Inventory...';

            wrapper.appendChild(content);

            // 3. Insert after the separator line
            const tradeRule = controlsDiv.querySelector('.trade_rule');
            if (tradeRule) {
                tradeRule.after(wrapper);
            } else {
                controlsDiv.prepend(wrapper);
            }

            displayElement = content;
        }
    }

    // --- Counting Logic ---
    function updateCounts() {
        if (!displayElement) {
            initUI();
            return;
        }

        const inventory = document.querySelector("div.inventory_ctn:not([style*='display: none'])");

        if (!inventory) {
            displayElement.innerText = 'Inventory not visible';
            return;
        }

        let keyCount = 0;
        let refCount = 0;
        let recCount = 0;
        let scrapCount = 0;

        const items = inventory.querySelectorAll("div.itemHolder div.item");

        items.forEach((item) => {
            const data = item.rgItem;
            if (data) {
                const classIdStr = String(data.classid);
                if (KEY_IDS.includes(classIdStr)) keyCount++;
                else if (classIdStr === REF_ID) refCount++;
                else if (classIdStr === REC_ID) recCount++;
                else if (classIdStr === SCRAP_ID) scrapCount++;
            }
        });

        const totalMetal = refCount + (recCount / 3) + (scrapCount / 9);

        // We use simple span tags so they inherit the parent font size
        displayElement.innerHTML = `
            <div style="border-bottom: 1px solid #3A3A3A; padding-bottom: 5px; margin-bottom: 5px;">
                <span style="color: #FFD700; font-weight: bold;">${keyCount} Keys</span> 
                <span style="color: #555; margin: 0 4px;">|</span>
                <span style="color: #eee;">${refCount} Ref</span>
                <span style="color: #777;">, ${recCount} Rec, ${scrapCount} Scrap</span>
            </div>
            <div>
                Total Metal: <span style="color: #fff;">${totalMetal.toFixed(2)} ref</span>
            </div>
        `;
    }

    setInterval(updateCounts, 1000);

})();