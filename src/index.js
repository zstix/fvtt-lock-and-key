// TODO: localize game.i18n.localize("KEY")
// LAK.ConfigTitle
// LAK.ConfigIntro
// LAK.ConfigKeyRequired
// LAK.ConfigKeyRequiredNotes
// LAK.ConfigKeyItem
// LAK.ConfigKeyItemNotes
// LAK.ConfigKeyRemove
// LAK.ConfigKeyRemoveNotes

// Next steps:
// Save flags
// Load flags
// Associate inventory
// User click event
// Permissions and checks
// Localization
// Packaging

const LAK = {
  SCOPE: "LAK",
  KEY_REQUIRED: "keyRequired",
  KEY_ITEM: "keyItem",
  KEY_REMOVE: "keyRemove",
};

const DEFAULTS = {
  [LAK.KEY_REQUIRED]: false,
  [LAK.KEY_ITEM]: undefined,
  [LAK.KEY_REMOVE]: true,
};

// TODO: initialize

const injectLockAndKeyConfig = (app, html, data) => {
  // Check if the user has permissions
  // Check if the wall is a door
  // Check if the tab is already added?

  renderConfig(app, html, data);
};

const getFlags = (id) => {
  console.log("Lock & Key  | getFlags");
  const wall = canvas.walls.get(id);

  // If the wall has the scope, return what's stored
  if (LAK.SCOPE in wall.data.flags) {
    return {
      keyRequired: object.getFlags(LAK.SCOPE, LAK.KEY_REQUIRED),
      keyItem: object.getFlag(LAK.SCOPE, LAK.KEY_ITEM),
      keyRemove: object.getFlag(LAK.SCOPE, LAK.KEY_REMOVE),
    };
  }

  // Otherwise, return the defaults
  return DEFAULTS;
};

// TODO: make work
const handleSubmit = (html) => () => {
  console.log("Lock & Key  | handleSubmit");
  const keyRequired = html.find('input[name="keyRequired"]').prop("checked");
  const keyItem = html.find('input[name="keyItem"]').prop("value");
  const keyRemove = html.find('input[name="keyRemove"]').prop("checked");

  console.log({ keyRequired, keyItem, keyRemove });
};

const renderConfig = (app, html, data) => {
  console.log("Lock & Key  | renderConfig");

  // Load door state
  const { keyRequired, keyItem, keyRemove } = getFlags(data.object._id);

  // Create the key configuration UI
  const keyConfigUI = `
    <h2><i class="fas fa-key"></i> Lock &amp; Key</h2>

    <div class="form-group">
      <label for="keyRequired">Require key?</label>
      <input name="keyRequired" type="checkbox" ${
        keyRequired ? "checked" : ""
      } />
      <p class="notes">Actor can unlock the door, if they have the specifid item in their inventory</p>
    </div>

    <div class="form-group">
      <label for="keyIem">Key item</label>
      <input name="keyItem" type="text" value="${keyItem || ""}" />
      <p class="notes">The name of the item (case sensitive)</p>
    </div>

    <div class="form-group">
      <label for="keyRemove">Remove key on use?</label>
      <input name="keyRemove" type="checkbox" ${keyRemove ? "checked" : ""} />
      <p class="notes">When the key item is used to unlock this door, it will be removed from the actor's inventory</p>
    </div>`;

  // Add the key configuration UI to the wall configuration dialog
  html.find(".form-group").last().after(keyConfigUI);

  // Add event listener
  html.find('button[type="submit"]').click(handleSubmit(html));
};

Hooks.once("renderWallConfig", injectLockAndKeyConfig);
