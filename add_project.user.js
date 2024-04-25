// ==UserScript==
// @name         Add Project Helper
// @namespace    www.hwpowere.com/
// @version      0.1
// @description  Proce ekleme kolayligisi
// @author       Koan
// @match        https://www.example.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
// @require      file://C:/Users/kaans/Desktop/Dev/kevser/tampermonkey/add_project.user.js
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  const Gui = new UserGui();
  Gui.settings.window.title = "GUI Demo"; // set window title
  Gui.settings.window.centered = true;

  Gui.addPage(
    "Project Parse",
    `<div class="rendered-form">
    <div class="formbuilder-text form-group field-text-projectinput">
        <label for="text-projectinput" class="formbuilder-text-label">Proje input<span class="tooltip-element" tooltip="emaildeki proce">?</span></label>
        <input type="text" class="form-control" name="text-projectinput" access="false" id="text-projectinput" title="emaildeki proce">
    </div>
    <div class="formbuilder-button form-group field-parse-project-btn">
        <button type="submit" class="btn-primary btn" name="parse-project-btn" access="false" style="primary" id="parse-project-btn">Bak bakalim</button>
    </div>
    <div class="formbuilder-textarea form-group field-textarea-project-name">
        <label for="textarea-project-name" class="formbuilder-textarea-label">Project Name</label>
        <textarea type="textarea" class="form-control" name="textarea-project-name" access="false" rows="1" id="textarea-project-name"></textarea>
    </div>
    <div class="formbuilder-button form-group field-button-projectname">
        <button type="button" class="btn-info btn" name="button-projectname" access="false" style="info" id="button-projectname">Copy Project Name</button>
    </div>
    <div class="formbuilder-text form-group field-text-workorder">
        <label for="text-workorder" class="formbuilder-text-label">Work Order</label>
        <input type="text" class="form-control disabled" name="text-workorder" access="false" id="text-workorder">
    </div>
    <div class="formbuilder-button form-group field-button-workorder">
        <button type="button" class="btn-info btn" name="button-workorder" access="false" style="info" id="button-workorder">Copy WO</button>
    </div>
    <div class="formbuilder-text form-group field-text-er">
        <label for="text-er" class="formbuilder-text-label">ER</label>
        <input type="text" class="form-control disabled" name="text-er" access="false" id="text-er">
    </div>
    <div class="formbuilder-button form-group field-button-copy-er">
        <button type="button" class="btn-info btn" name="button-copy-er" access="false" style="info" id="button-copy-er">Copy ER</button>
    </div>
    <div class="formbuilder-text form-group field-text-sp">
        <label for="text-sp" class="formbuilder-text-label">SP</label>
        <input type="text" class="form-control disabled" name="text-sp" access="false" id="text-sp">
    </div>
    <div class="formbuilder-button form-group field-button-copy-sp">
        <button type="button" class="btn-info btn" name="button-copy-sp" access="false" style="info" id="button-copy-sp">Copy SP</button>
    </div>
</div>`
  );
  const openBtn = document.createElement("button");
  openBtn.innerText = "Open GUI";
  openBtn.onclick = () => {
    openGui();
  };

  document.querySelector("div").appendChild(openBtn);

  function openGui() {
    Gui.open(() => {
      Gui.event("parse-project-btn", "click", () => {
        const inputString = Gui.getValue("text-projectinput");
        const result = parseData(inputString);
        Gui.setValue("textarea-project-name", result.formattedString);
        Gui.setValue("text-workorder", result.workOrderNumber);
        Gui.setValue("text-er", result.erNumber);
        Gui.setValue("text-sp", result.spNumber);
      });

      Gui.loadConfig();
    });
  }
})();

function parseData(inputString) {
  // Extract the project name
  const projectNameMatch = inputString.match(/^(.*?)\:/);
  const projectName = projectNameMatch ? projectNameMatch[1] : null;

  // Extract the work order number
  const workOrderMatch = inputString.match(/WO\s(\d+)/);
  const workOrderNumber = workOrderMatch ? workOrderMatch[1] : null;

  // Extract the ER number
  const erMatch = inputString.match(/ER\s(\d+)/);
  const erNumber = erMatch ? erMatch[1] : null;

  // Extract the SP number
  const spMatch = inputString.match(/SP\s([A-Z0-9]+)/);
  const spNumber = spMatch ? spMatch[1] : null;

  // Print the values
  console.log(`Project Name: ${projectName}`);
  console.log(`Work Order Number: ${workOrderNumber}`);
  console.log(`ER Number: ${erNumber}`);
  console.log(`SP Number: ${spNumber}`);

  // Generate the formatted string
  const formattedString = `${projectName} (SP#${spNumber}/ER${erNumber}/WO#${workOrderNumber})`;
  console.log(formattedString);

  // Return the formatted string in case it needs to be used elsewhere
  return {
    projectName,
    workOrderNumber,
    erNumber,
    spNumber,
    formattedString,
  };
}
