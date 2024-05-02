// ==UserScript==
// @name          Add Project Helper
// @namespace     www.hwpowere.com/
// @version       0.1
// @description   Proce ekleme kolayligisi
// @author        Koan
// @match         https://www.example.com/
// @match         *://hpowereuat.azurewebsites.net/*
// @match         *://hpoweredev.azurewebsites.net/*
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @resource      BT_ICONS https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_setClipboard
// @grant         GM_getResourceText
// @grant         GM_addStyle
// @require       https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
// @require       file://C:/Users/kaans/Desktop/Dev/kevser/tampermonkey/add_project.user.js
// @run-at        document-end
// ==/UserScript==

(function () {
  "use strict";
  const bt_icons = GM_getResourceText("BT_ICONS");
  GM_addStyle(bt_icons);
  const Gui = new UserGui();
  Gui.settings.window.title = "Kievs Helper"; // set window title
  Gui.settings.window.centered = true;
  Gui.settings.window.external = true;
  Gui.addPage(
    "Project Parse",
    `<div class="rendered-form">
    <div class="formbuilder-text form-group field-text-projectinput">
        <label for="text-projectinput" class="formbuilder-text-label">Proje input<span class="tooltip-element" tooltip="emaildeki proce">?</span></label>
        <input type="text" class="form-control" name="text-projectinput" access="false" id="text-projectinput" title="emaildeki proce" autocomplete="off">
    </div>
    <div class="formbuilder-button form-group field-parse-project-btn">
        <button type="submit" class="btn-primary btn" name="parse-project-btn" access="false" style="primary" id="parse-project-btn">Bak bakalim</button>
    </div>
    <div class="formbuilder-button form-group field-button-apply-values">
        <button type="submit" class="btn-success btn" name="button-apply-values" value="Apply" access="false" style="success" id="button-apply-values">Apply</button>
    </div>
    <div class="formbuilder-textarea form-group field-textarea-project-name">
        <label for="textarea-project-name" class="formbuilder-textarea-label">Project Name</label>
        <textarea type="textarea" class="form-control" name="textarea-project-name" access="false" rows="3" id="textarea-project-name"></textarea>
    </div>
    <div class="formbuilder-button form-group field-button-copy-projectname">
        <button type="button" class="btn-info btn" name="button-copy-projectname" access="false" style="info" id="button-copy-projectname">Copy Project Name</button>
    </div>
    <div class="formbuilder-text form-group field-text-workorder ">
        <label for="text-workorder" class="formbuilder-text-label">Work Order</label>
        <div class="d-flex flex-row">
          <input type="text" class="form-control disabled" name="text-workorder" access="false" id="text-workorder">
          <button type="button" class="btn-info btn" name="button-copy-workorder" access="false" style="info" id="button-copy-workorder">Copy</button>
        </div>
    </div>
    <div class="formbuilder-text form-group field-text-er">
        <label for="text-er" class="formbuilder-text-label">ER</label>
        <div class="d-flex flex-row">
          <input type="text" class="form-control disabled" name="text-er" access="false" id="text-er">
          <button type="button" class="btn-info btn" name="button-copy-er" access="false" style="info" id="button-copy-er">Copy</button>
        </div>
    </div>
    <div class="formbuilder-text form-group field-text-sp">
        <label for="text-sp" class="formbuilder-text-label">SP</label>
         <div class="d-flex flex-row">
          <input type="text" class="form-control disabled" name="text-sp" access="false" id="text-sp">
          <button type="button" class="btn-info btn" name="button-copy-sp" access="false" style="info" id="button-copy-sp">Copy</button>
        </div>
    </div>
    <div class="formbuilder-checkbox-group form-group field-checkbox-group-ayarlar">
        <label for="checkbox-group-ayarlar" class="formbuilder-checkbox-group-label">Ayarlar</label>
        <div class="checkbox-group">
            <div class="formbuilder-checkbox">
                <input name="checkbox-group-ayarlar[]" access="false" id="checkbox-group-ayarlar-0" value="acc-equals-er" type="checkbox" checked="checked">
                <label for="checkbox-group-ayarlar-0">Acc No = ER mi?</label>
            </div>
        </div>
    </div>
</div>`
  );
  const openBtn = document.createElement("button");
  openBtn.innerText = "Kievs Helperr";
  openBtn.style.display = "block";
  openBtn.style.position = "fixed";
  openBtn.style.top = "10px";
  openBtn.style.right = "10px";
  openBtn.style.zIndex = "9999";

  openBtn.onclick = () => {
    openGui();
  };

  document.querySelector("body").appendChild(openBtn);

  function openGui() {
    Gui.open(() => {
      // Load values

      Gui.setValue("textarea-project-name", GM_getValue("projectName"));

      Gui.setValue("text-workorder", GM_getValue("workOrderNumber"));

      Gui.setValue("text-er", GM_getValue("erNumber"));

      Gui.setValue("text-sp", GM_getValue("spNumber"));

      // Add event listeners
      Gui.event("parse-project-btn", "click", () => {
        const inputString = Gui.getValue("text-projectinput");
        const result = parseData(inputString);
        Gui.setValue("textarea-project-name", result.formattedString);
        Gui.setValue("text-workorder", result.workOrderNumber);
        Gui.setValue("text-er", result.erNumber);
        Gui.setValue("text-sp", result.spNumber);
      });
      Gui.event("button-apply-values", "click", () => {
        applyData();
      });

      Gui.event("button-copy-projectname", "click", () => {
        const projectName = Gui.getValue("textarea-project-name");
        GM_setClipboard(projectName);
      });
      Gui.event("button-copy-workorder", "click", () => {
        const workOrderNumber = Gui.getValue("text-workorder");
        GM_setClipboard(workOrderNumber);
      });
      Gui.event("button-copy-er", "click", () => {
        const erNumber = Gui.getValue("text-er");
        console.log(erNumber);

        GM_setClipboard(erNumber);
      });
      Gui.event("button-copy-sp", "click", () => {
        const spNumber = Gui.getValue("text-sp");
        GM_setClipboard(spNumber);
      });

      Gui.loadConfig();
    });
  }

  function getSettings() {
    const settings = Gui.getChecked("checkbox-group-ayarlar");

    return {
      erEqualAccNo: settings.includes("acc-equals-er"),
    };
  }
  function applyData() {
    const projectInput = Gui.getValue("text-projectinput") || "";
    const projectName = Gui.getValue("textarea-project-name") || "";
    const workOrderNumber = Gui.getValue("text-workorder") || "";
    const erNumber = Gui.getValue("text-er") || "";
    const spNumber = Gui.getValue("text-sp") || "";

    const er_Input = document.querySelector("#Project_Er");
    const wo_Input = document.querySelector("#Project_WorkOrder");
    const sp_Input = document.querySelector("#Project_Sp");
    const project_Name_Input = document.querySelector("#Project_Name");
    const project_Description_Input = document.querySelector(
      "#Project_Description"
    );

    project_Description_Input.value = projectInput;
    project_Name_Input.value = projectName;
    er_Input.value = erNumber;
    wo_Input.value = workOrderNumber;
    sp_Input.value = spNumber;

    console.log(getSettings().erEqualAccNo);
    if (getSettings().erEqualAccNo) {
      document.querySelector("#Project_AccountNumber").value = erNumber;
    }
  }
})();

function parseData(inputString) {
  // Extract the project name
  const projectNameMatch = inputString.match(/^(.*?)\:/);
  const projectName = projectNameMatch ? projectNameMatch[1] : "olmadi 😟";

  const spWoMatch = inputString.match(/SP\/WO\s(\d+)/);

  if (spWoMatch) {
    // If the pattern is found, set both SP and WO to the same number
    spNumber = spWoMatch[1];
    workOrderNumber = spWoMatch[1];
  } else {
    // If the pattern is not found, extract the work order number and SP number separately
    const workOrderMatch = inputString.match(/WO\s(\d+)/);
    workOrderNumber = workOrderMatch ? workOrderMatch[1] : "";

    const spMatch = inputString.match(/SP\s([A-Z0-9]+)/);
    spNumber = spMatch ? spMatch[1] : "";
  }

  // Extract the ER number
  const erMatch = inputString.match(/ER\s(\d+)/);
  const erNumber = erMatch ? erMatch[1] : "";
  // Print the values
  console.log(`Project Name: ${projectName}`);
  console.log(`Work Order Number: ${workOrderNumber}`);
  console.log(`ER Number: ${erNumber}`);
  console.log(`SP Number: ${spNumber}`);

  // Generate the formatted string
  const formattedString = `${projectName} (SP#${spNumber}/ER#${erNumber}/WO#${workOrderNumber})`;
  console.log(formattedString);

  // Save values
  GM_setValue("projectInput", inputString);
  GM_setValue("projectName", projectName);
  GM_setValue("workOrderNumber", workOrderNumber);
  GM_setValue("erNumber", erNumber);
  GM_setValue("spNumber", spNumber);

  // Return the formatted string in case it needs to be used elsewhere
  return {
    projectName,
    workOrderNumber: workOrderNumber,
    erNumber: erNumber,
    spNumber: spNumber,
    formattedString,
  };
}
