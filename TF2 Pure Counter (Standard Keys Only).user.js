// ==UserScript==
// @name        TF2 Wallet Counter (Embedded Text)
// @namespace   https://github.com/Raytr0
// @version     1.2
// @author      Raytr0
// @description Counts TF2 currency and embeds the result as text in the trade panel.
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

        // If controls exist but we haven't added our display yet
        if (controlsDiv && !document.getElementById('tf2_wallet_display')) {

            // Create the wrapper div
            // 'control_fields' gives it the correct Steam margins/padding
            const wrapper = document.createElement('div');
            wrapper.id = 'tf2_wallet_display';
            wrapper.className = 'control_fields';
            wrapper.style.marginBottom = '10px';
            wrapper.style.width = '100%'; // Dynamically fit horizontal area
            wrapper.style.boxSizing = 'border-box'; // Ensure padding doesn't break width

            // Create the Content Div
            // We use 'selectableNone' to match the other labels behavior
            const content = document.createElement('div');
            content.className = 'selectableNone';

            // Styling to match the existing background (transparent) and font
            content.style.width = '100%';
            content.style.fontSize = '12px';
            content.style.fontFamily = 'Arial, Helvetica, sans-serif';
            content.style.color = '#8F98A0'; // Standard Steam label color
            content.style.lineHeight = '16px';
            content.style.textAlign = 'left';
            content.innerHTML = 'Scanning Inventory...';

            // Assemble
            wrapper.appendChild(content);

            // Insert into the controls div after the horizontal rule
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
            displayElement.innerHTML = 'Inventory not visible';
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

        // Calculate Total Ref Value
        const totalMetal = refCount + (recCount / 3) + (scrapCount / 9);

        // Update HTML
        // Using a flex-like layout with spans to fit horizontally
        displayElement.innerHTML = `
            <div style="border-bottom: 1px solid #3A3A3A; padding-bottom: 4px; margin-bottom: 4px;">
                <span style="color: #FFD700; font-weight: bold;">${keyCount} Keys</span>
                <span style="color: #666; margin: 0 5px;">|</span>
                <span style="color: #eee;">${refCount} Ref</span>
                <span style="color: #888;">, ${recCount} Rec, ${scrapCount} Scrap</span>
            </div>
            <div>
                Total Metal Value: <span style="color: #fff; font-weight: bold;">${totalMetal.toFixed(2)} ref</span>
            </div>
        `;
    }

    setInterval(updateCounts, 1000);

})();