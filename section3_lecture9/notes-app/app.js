// const fileSystem = require('fs');

// fileSystem.writeFileSync('node.txt', 'this is super Peter!!!');

// fileSystem.appendFileSync('node.txt', 'Super Peter is so awesome!!!');

// const yellMethods = require('./node');
// yellMethods();

// =====================validator===============
// const validator = require('validator');

// console.log(validator.isEmail('example@163.com'));
// =====================validator===============

// ====================================chalk========================
// const chalk = require('chalk');
// const log = console.log;

// log(chalk.yellow.bgRed.bold('success!!'));
// ====================================chalk========================


// ===============================yargs=======================
const yargs = require('yargs');
const notes = require('./note');
// console.log(process.argv);
// console.log('--------------------');

yargs.command({
    command: 'add',
    describe: 'this is a add command',
    builder: {
        title: {
            describe: 'Notes title you need to add',
            demandOption: true,
            type: 'string',
        },
        body: {
            describe: 'Notes body you need to add',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        notes.addNote(argv.title, argv.body);
    }
});

yargs.command({
    command: 'remove',
    describe: 'this is a remove command',
    builder: {
        title: {
            describe: 'Notes title you need to remove',
            demandOption: true,
            type: 'string',
        },
    },
    handler: (argv) => {
        notes.removeNote(argv.title);
    }
});

yargs.command({
    command: 'read',
    describe: 'this is a read commond',
    builder: {
        title: {
            describe: 'Notes title',
            demandOption: true,
            type: 'string',
        },
    },
    handler: function (argv) {
        notes.readNote(argv.title);
    }
});
yargs.command({
    command: 'list',
    describe: 'this is a list commond',
    handler: () => {
        notes.listNotes();
    }
});
console.log(yargs.argv);
// ===============================yargs=======================
