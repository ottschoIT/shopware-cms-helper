const currentDir = process.cwd();
const fs = require('fs');
const fileController = require('./fileController');

class storefrontTemplateController {
    constructor() {
        this.files = new fileController();
    }

    getPluginName() {
        return this.name;
    }

    setPluginName(name) {
        this.name = name;
    }

    getCmsName() {
        return this.cmsName;
    }

    setCmsName(cmsName) {
        this.cmsName = cmsName;
    }

    getCmsBlockType() {
        return this.cmsBlocktype;
    }

    setCmsBlockType(type) {
        this.cmsBlocktype = type;
    }

    createFromTemplates() {
        this.composerPath = this.files.getComposerPath(currentDir);
        this.storefrontDir = this.composerPath + `/custom/plugins/${this.getPluginName()}/src/Resources/views/storefront/`;

        let template = fs.readFileSync(`templates/storefront/storefront.html.twig.template`, "utf8");

        if (this.getCmsBlockType() === "block") {
            this.files.createDirectory(`${this.storefrontDir}block`)
            template = template.replace(/##block-name##/g, this.getCmsName().replace(/-/g, '_'));
            fs.writeFileSync(`${this.storefrontDir}block/cms-block-${this.getCmsName()}.html.twig`, template);
        } else {
            this.files.createDirectory(`${this.storefrontDir}element`);
            template = template.replace(/##block-name##/g, this.getCmsName().replace(/-/g, '_'));
            fs.writeFileSync(`${this.storefrontDir}element/cms-element-${this.getCmsName()}.html.twig`, template);
        }
    }

}

module.exports = storefrontTemplateController;
