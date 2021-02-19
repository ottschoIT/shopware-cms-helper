'use strict';

const pluginTemplateController = require('./pluginTemplateController');
const inquirer = require('inquirer');

let questions = [
    {
        type: 'input',
        name: 'plugin-name',
        message: "Plugin name?",
        validate: function (input) {
            return input !== "";
        }
    },
    {
        type: 'list',
        name: 'type',
        message: "Block or Element?",
        choices: ['block', 'element'],
    },
    {
        type: 'list',
        name: 'block-type',
        message: 'Choose your block-type:',
        choices: ["text", "text-image", "image", "commerce", "form", "sidebar", "video"],
    },
    {
        type: 'input',
        name: 'cms-name',
        message: 'CMS (Block / Element) name? (Lowercase with hyphens):',
        validate: function (input) {
            return input !== "";
        }
    }
];

const Rx = require('rxjs');
const prompts = new Rx.Subject();
const pluginTemplate = new pluginTemplateController();

inquirer.prompt(prompts).ui.process.subscribe(async function(event) {
    let nextQuestion = null;

    switch (event.name) {
        case "plugin-name":
            pluginTemplate.setPluginName(event.answer);
            nextQuestion = questions[1];
            break;
        case "type":
            pluginTemplate.setCmsType(event.answer);
            pluginTemplate.setCmsType(event.answer);

            if (event.answer === "block") {
                nextQuestion = questions[2];
            } else {
                nextQuestion = questions[3];
            }
            break;
        case "block-type":
            nextQuestion = questions[3];
            pluginTemplate.setCmsBlockType(event.answer);
            break;
        case "cms-name":
            pluginTemplate.setCmsName(event.answer);
            pluginTemplate.setCmsName(event.answer);
            break;
    }

    if (nextQuestion) {
        prompts.next(nextQuestion);
    } else {
        pluginTemplate.createPlugin();
        prompts.complete();
    }
});

prompts.next(questions[0]);
