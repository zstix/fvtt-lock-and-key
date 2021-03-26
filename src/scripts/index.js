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
// Associate inventory
// User click event
// Permissions and checks
// Localization
// Packaging

const LAK = {
  SCOPE: "lock-and-key",
  LOG_PREFIX: "Lock & Key |",
  KEY_REQUIRED: "keyRequired",
  KEY_ITEM: "keyItem",
  KEY_REMOVE: "keyRemove",
};

const DEFAULTS = {
  [LAK.KEY_REQUIRED]: false,
  [LAK.KEY_ITEM]: undefined,
  [LAK.KEY_REMOVE]: true,
};

const init = () => {
  console.log(LAK.LOG_PREFIX, "init");

  Hooks.once("renderWallConfig", injectLockAndKeyConfig);
};

const injectLockAndKeyConfig = (app, html, data) => {
  console.log(LAK.LOG_PREFIX, "injectLockAndKeyConfig");

  // Check if the user has permissions
  // Check if the wall is a door
  // Check if the tab is already added?

  renderConfig(app, html, data);
};

const getFlags = (id) => {
  console.log(LAK.LOG_PREFIX, "getFlags");

  const wall = canvas.walls.get(id);

  // If the wall has the scope, return what's stored
  if (LAK.SCOPE in wall.data.flags) {
    return {
      keyRequired: wall.getFlag(LAK.SCOPE, LAK.KEY_REQUIRED),
      keyItem: wall.getFlag(LAK.SCOPE, LAK.KEY_ITEM),
      keyRemove: wall.getFlag(LAK.SCOPE, LAK.KEY_REMOVE),
    };
  }

  // Otherwise, return the defaults
  return DEFAULTS;
};

const handleSubmit = (html, id) => () => {
  console.log(LAK.LOG_PREFIX, "handleSubmit");

  const wall = canvas.walls.get(id);

  // Get the values from the configuration UI
  const keyRequired = html.find('input[name="keyRequired"]').prop("checked");
  const keyItem = html.find('input[name="keyItem"]').prop("value");
  const keyRemove = html.find('input[name="keyRemove"]').prop("checked");

  // Save the values
  wall.setFlag(LAK.SCOPE, LAK.KEY_REQUIRED, keyRequired);
  wall.setFlag(LAK.SCOPE, LAK.KEY_ITEM, keyItem);
  wall.setFlag(LAK.SCOPE, LAK.KEY_REMOVE, keyRemove);
};

const renderConfig = (app, html, data) => {
  console.log(LAK.LOG_PREFIX, "renderConfig");

  // Load door state
  const id = data.object._id;
  const { keyRequired, keyItem, keyRemove } = getFlags(id);

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
  html.find('button[type="submit"]').click(handleSubmit(html, id));
};

Hooks.on("init", init);
