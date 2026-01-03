// ==UserScript==
// @name        TF2 Pure Counter (Standard Keys Only)
// @namespace   https://github.com/Raytr0
// @version     1.0
// @author      Raytr0
// @description Counts TF2 currency (Standard Keys & Metal) in trade offers.
// @include     /^https?:\/\/steamcommunity\.com\/tradeoffer.*/
// @grant       none
// ==/UserScript==

(function() {
    'use strict';
    // --- Configuration ---
    // ONLY the Standard "Mann Co. Supply Crate Key" ID
    const KEY_IDS = ["101785959"];
    // Metal IDs
    const REF_ID = "2674";   // Refined Metal
    const REC_ID = "5564";   // Reclaimed Metal
    const SCRAP_ID = "2675"; // Scrap Metal

    // --- UI Creation ---
    const infoBox = document.createElement('div');
    infoBox.style.position = 'fixed';
    infoBox.style.bottom = '10px';
    infoBox.style.left = '10px';
    infoBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    infoBox.style.color = '#fff';
    infoBox.style.padding = '10px';
    infoBox.style.fontFamily = 'Arial, sans-serif';
    infoBox.style.fontSize = '16px';
    infoBox.style.borderRadius = '5px';
    infoBox.style.zIndex = '9999';
    infoBox.style.border = '2px solid #7D6D00';
    infoBox.textContent = "Loading Inventory...";
    document.body.appendChild(infoBox);

    // --- Main Logic ---
    function findAmount() {
        // 1. Find the currently visible inventory container
        const inventory = document.querySelector("div.inventory_ctn:not([style*='display: none'])");

        if (!inventory) {
            infoBox.textContent = "No Inventory Visible";
            return;
        }

        // 2. Initialize Counters
        let keyCount = 0;
        let refCount = 0;
        let recCount = 0;
        let scrapCount = 0;

        // 3. Select all item elements inside this inventory
        const items = inventory.querySelectorAll("div.itemHolder div.item");

        // 4. Loop through items
        items.forEach((item) => {
            // Steam attaches item data to the DOM element property 'rgItem'
            const data = item.rgItem;

            if (data) {
                const classIdStr = String(data.classid);

                if (KEY_IDS.includes(classIdStr)) {
                    keyCount++;
                } else if (classIdStr === REF_ID) {
                    refCount++;
                } else if (classIdStr === REC_ID) {
                    recCount++;
                } else if (classIdStr === SCRAP_ID) {
                    scrapCount++;
                }
            }
        });

        // 5. Update the Display
        // Calculates decimal value (Refined + Reclaimed/3 + Scrap/9)
        const totalMetal = refCount + (recCount / 3) + (scrapCount / 9);

        infoBox.innerHTML = `
            <span style="color: #FFD700; font-weight: bold;">Keys: ${keyCount}</span> <br/>
            <span style="color: #B0C3D9;">Ref: ${refCount}</span> |
            <span style="color: #8D99A5;">Rec: ${recCount}</span> |
            <span style="color: #555;">Scrap: ${scrapCount}</span> <br/>
            <span style="font-size: 12px; color: #aaa;">(Total Metal: ~${totalMetal.toFixed(2)} ref)</span>
        `;
    }

    // Run the function every 1 second
    setInterval(findAmount, 1000);

})();