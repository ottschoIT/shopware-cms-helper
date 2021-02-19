const fs = require('fs');
const currentDir = process.cwd();
const fileController = require('./fileController');
const adminTemplateController = require('./adminTemplateController');
const storefrontTemplateController = require('./storefrontTemplateController');

class pluginTemplateController {
    constructor() {
        this.files = new fileController();
    }

    getPluginNameHyphen() {
        return this.getPluginName().replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase().replace('ott-', '');
    }

    getPluginName() {
        return this.name;
    }

    setPluginName(name) {
        this.name = name;
    }

    getCmsType() {
        return this.cmsType;
    }

    setCmsType(cmsType) {
        this.cmsType = cmsType;
    }

    getCmsBlockType() {
        return this.cmsBlockType;
    }

    setCmsBlockType(cmsBlockType) {
        this.cmsBlockType = cmsBlockType;
    }

    getCmsName() {
        return this.cmsName;
    }

    setCmsName(cmsName) {
        this.cmsName = cmsName;
    }

    setConfigPath() {
        this.composerPath = this.files.getComposerPath(currentDir);
        this.pluginsDir = this.composerPath + "/custom/plugins/";
        this.templateFolder = `${__dirname}/templates/`;
    }

    createPlugin() {
        this.setConfigPath();

        // Create plugin main directory
        this.files.createDirectory(`${this.pluginsDir}${this.getPluginName()}`);

        // Create composer.json
        let composerTemplate = fs.readFileSync(`${this.templateFolder}plugin/composer.json.template`, "utf8");
        composerTemplate = composerTemplate.replace(/##plugin-name-hyphens##/g, this.getPluginNameHyphen());
        composerTemplate = composerTemplate.replace(/##plugin-name##/g, this.getPluginName());
        fs.writeFileSync(`${this.pluginsDir}${this.getPluginName()}/composer.json`, composerTemplate);

        // Create directories src and Resources
        this.files.createDirectory(`${this.pluginsDir}${this.getPluginName()}/src/Resources`);

        // Add ottscho logo
        const logoDestination = `${this.pluginsDir}${this.getPluginName()}/src/plugin.png`;

        fs.readFile(`${this.templateFolder}plugin/plugin.png`, function (err, data) {
            if (err) throw err;

            fs.writeFile(logoDestination, data, 'base64', function (err) {
                if (err) throw err;
            });
        });

        // Create bootstrap
        let bootstrapTemplate = fs.readFileSync(`${this.templateFolder}plugin/base.php.template`, "utf8");
        bootstrapTemplate = bootstrapTemplate.replace(/##plugin-name##/g, this.getPluginName());
        fs.writeFileSync(`${this.pluginsDir}${this.getPluginName()}/src/${this.getPluginName()}.php`, bootstrapTemplate);

        // Create admin cms template files
        const adminTemplate = new adminTemplateController();
        adminTemplate.setPluginName(this.getPluginName());
        adminTemplate.setCmsType(this.getCmsType());
        adminTemplate.setCmsName(this.getCmsName());
        adminTemplate.setCmsBlockType(this.getCmsBlockType());
        adminTemplate.createFromTemplates();

        // Create storefront cms template files
        const storefrontTemplate = new storefrontTemplateController();
        storefrontTemplate.setPluginName(this.getPluginName());
        storefrontTemplate.setCmsName(this.getCmsName());
        storefrontTemplate.setCmsBlockType(this.getCmsBlockType());
        storefrontTemplate.createFromTemplates();
    }
}

module.exports = pluginTemplateController;
