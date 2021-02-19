const swPrefix = "ott-cms-";
const fs = require('fs');
const currentDir = process.cwd();
const fileController = require('./fileController');

class adminTemplateController {
    constructor() {
        this.files = new fileController();
    }

    getPluginName() {
        return this.pluginName;
    }

    setPluginName(name) {
        this.pluginName = name;
    }

    getCmsType() {
        return this.cmsType;
    }

    setCmsType(type){
        this.cmsType = type;
    }

    getCmsName() {
        return this.cmsName;
    }

    setCmsName(name){
        this.cmsName = name;
    }

    getCmsBlockType() {
        return this.cmsBlockType;
    }

    setCmsBlockType(type){
        this.cmsBlockType = type;
    }

    setConfigPath() {
        this.composerPath = this.files.getComposerPath(currentDir);
        this.adminDir = this.composerPath + `/custom/plugins/${this.getPluginName()}/src/Resources/app/administration/src/ott-cms/`;

        if (this.getCmsType() === "block"){
            this.templateFolder = `${__dirname}/templates/admin/block/`;

            this.previewClass = `${swPrefix}block-preview-${this.getCmsName()}`;
            this.previewBlock = `${swPrefix.replace(/-/g, '_')}block_preview_${this.getCmsName().replace(/-/g, '_')}`;

            this.componentClass = `${swPrefix}block-${this.getCmsName()}`;
            this.componentBlock = `${swPrefix.replace(/-/g, '_')}block_${this.getCmsName().replace(/-/g, '_')}`;

            this.adminDir += "blocks/";
        }else if (this.getCmsType() === "element"){
            this.templateFolder = `${__dirname}/templates/admin/element/`;

            this.previewClass = `${swPrefix}el-preview-${this.getCmsName()}`;
            this.previewBlock = `${swPrefix.replace(/-/g, '_')}element_preview_${this.getCmsName().replace(/-/g, '_')}`;

            this.configClass = `${swPrefix}el-config-${this.getCmsName()}`;
            this.configBlock = `${swPrefix.replace(/-/g, '_')}element_config_${this.getCmsName().replace(/-/g, '_')}`;

            this.componentClass = `${swPrefix}el-${this.getCmsName()}`;
            this.componentBlock = `${swPrefix.replace(/-/g, '_')}element_${this.getCmsName().replace(/-/g, '_')}`;

            this.adminDir += "elements/";
        } else {
            throw "type is not supported!";
        }

        this.adminDir += this.getCmsName() + "/";
        this.previewDir = this.adminDir + "preview/";
        this.configDir = this.adminDir + "config/";
        this.componentDir = this.adminDir + "component/";
    }

    createFromTemplates() {
        this.setConfigPath();
        this.files.createDirectory(this.previewDir);
        this.files.createDirectory(this.componentDir);

        if (this.getCmsType() === "block") {
            this.createBlock();
        } else if (this.getCmsType() === "element") {
            this.files.createDirectory(this.configDir);
            this.createElement();
        }

        this.createMainJs();
    }

    createBlock() {
        this.createComponent();
        this.createPreview();
        this.createIndex();
    }

    createElement() {
        this.createConfig();
        this.createComponent();
        this.createPreview();
        this.createIndex();
    }

    createMainJs() {
        const mainJsPath = this.composerPath + `/custom/plugins/${this.getPluginName()}/src/Resources/app/administration/src/`;
        const mainJsContent = `import './ott-cms/elements/${this.getCmsName()}'`;

        fs.writeFileSync(`${mainJsPath}main.js`, mainJsContent);
    }

    createComponent() {
        let block = fs.readFileSync(`${this.templateFolder}component/component.scss.template`, "utf8");
        block = block.replace(/##class##/g, this.componentClass);
        fs.writeFileSync(`${this.componentDir}${this.componentClass}.scss`, block);

        block = fs.readFileSync(`${this.templateFolder}component/component.html.twig.template`, "utf8");
        block = block.replace(/##class##/g, this.componentClass);
        block = block.replace(/##block##/g, this.componentBlock);
        fs.writeFileSync(`${this.componentDir}${this.componentClass}.html.twig`, block);

        block = fs.readFileSync(`${this.templateFolder}component/index.js.template`, "utf8");
        block = block.replace(/##class##/g, this.componentClass);
        block = block.replace(/##name##/g, this.getCmsName());
        fs.writeFileSync(`${this.componentDir}index.js`, block);
    }

    createConfig() {
        let block = fs.readFileSync(`${this.templateFolder}config/config.scss.template`, "utf8");
        block = block.replace(/##class##/g, this.configClass);
        fs.writeFileSync(`${this.configDir}${this.configClass}.scss`, block);

        block = fs.readFileSync(`${this.templateFolder}config/config.html.twig.template`, "utf8");
        block = block.replace(/##class##/g, this.configClass);
        block = block.replace(/##block##/g, this.configBlock);
        fs.writeFileSync(`${this.configDir}${this.configClass}.html.twig`, block);

        block = fs.readFileSync(`${this.templateFolder}config/index.js.template`, "utf8");
        block = block.replace(/##class##/g, this.configClass);
        block = block.replace(/##name##/g, this.getCmsName());
        fs.writeFileSync(`${this.configDir}index.js`, block);
    }

    createPreview() {
        let block = fs.readFileSync(`${this.templateFolder}preview/preview.scss.template`, "utf8");
        block = block.replace(/##class##/g, this.previewClass);
        fs.writeFileSync(`${this.previewDir}${this.previewClass}.scss`, block);

        block = fs.readFileSync(`${this.templateFolder}preview/preview.html.twig.template`, "utf8");
        block = block.replace(/##class##/g, this.previewClass);
        block = block.replace(/##block##/g, this.previewBlock);
        fs.writeFileSync(`${this.previewDir}${this.previewClass}.html.twig`, block);

        block = fs.readFileSync(`${this.templateFolder}preview/index.js.template`, "utf8");
        block = block.replace(/##class##/g, this.previewClass);
        fs.writeFileSync(`${this.previewDir}index.js`, block);
    }

    createIndex() {
        let block = fs.readFileSync(`${this.templateFolder}index.js.template`, "utf8");
        block = block.replace(/##name##/g, this.getCmsName());
        block = block.replace(/##block-type##/g, this.getCmsBlockType());
        block = block.replace(/##preview-class##/g, this.previewClass);
        
        if (this.configClass){
            block = block.replace(/##config-class##/g, this.configClass);
        }

        block = block.replace(/##component-class##/g, this.componentClass);
        fs.writeFileSync(`${this.adminDir}index.js`, block);
    }
}

module.exports = adminTemplateController;
