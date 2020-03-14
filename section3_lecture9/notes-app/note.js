const fs = require('fs');
const chalk = require('chalk');

const getNote = () => {
    return console.log('note');
};

const addNote = (title, body) => {

    const noteData = loadNotes();


    const duplicateNote = noteData.find(item => item.title === title)

    if (duplicateNote != undefined) {
        console.log(chalk.yellow.inverse('note has been token'));
    } else {
        noteData.push({
            title,
            body,
        });
        fs.writeFileSync('note.json', JSON.stringify(noteData));
        console.log(chalk.green.inverse('note has been added'));
    }
}

const removeNote = (title) => {
    const noteData = loadNotes();
    let idx = -1;
    noteData.map((item, index) => {
        if (item.title === title) {
            idx = index;
        }
    });

    if (idx !== -1) {
        noteData.splice(idx, 1);
        fs.writeFileSync('note.json', JSON.stringify(noteData));
        console.log(chalk.bgGreen('remove successfully'));
    } else {
        console.log(chalk.bgRed('the note you want to delete is not exist'));
    }
}

const readNote = (title) => {
    const noteData = loadNotes();
    const targetNote =  noteData.find(item => item.title === title);
    if (targetNote !== undefined) {
        console.log(chalk.bgGreen(targetNote.body));
    } else {
        console.log(chalk.bgRed('the note you want to read is not exist!!!'));
    }

}

const listNotes = () => {
    const noteData = loadNotes();
    noteData.forEach((item) => {
        console.log(chalk.bgBlueBright('title:')+ item.title);
        console.log(chalk.bgBlueBright('body:') + item.body);
    })
}

const loadNotes = () => {
    try {
        const noteBuff = fs.readFileSync('note.json');
        const noteData = noteBuff.toString();
        return JSON.parse(noteData);
    } catch(e) {
        return [];
    }
}

module.exports = {
    getNote,
    addNote,
    removeNote,
    readNote,
    listNotes,
};