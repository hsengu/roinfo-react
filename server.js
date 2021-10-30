const memoryjs = require('memoryjs');
const addr = require('./address.json');

const processIdentifier = addr.process;
const processObject = memoryjs.openProcess(processIdentifier);

function main() {
    parseAddresses(addr.account, addr.account.player.offset, addr.account.player.pet.offset, addr.account.player.homunculus.offset);

    let player = getPlayerInfo(addr.account.id, addr.account.player.offset);
    let pet = getPetInfo(addr.account.id, addr.account.player.pet.offset);
    let homunculus = getHomunculusInfo(addr.account.id, addr.account.player.homunculus.offset);

    console.log(player, pet, homunculus);
}

function parseAddresses(account, player, pet, homunculus) {
    account['id'] = parseInt(account.id);

    player = Object.keys(player).forEach(key => {
        player[key] = parseInt(player[key]);
    });

    pet = Object.keys(pet).forEach(key => {
        pet[key] = parseInt(pet[key]);
    });

    homunculus = Object.keys(homunculus).forEach(key => {
        homunculus[key] = parseInt(homunculus[key]);
    });
}

function getPlayerInfo(id, {name, loggedIn, baseExp, jobExp, baseLvl, jobLvl, baseReq, jobReq}) {
    const read = { 
        account: memoryjs.readMemory(processObject.handle, id, "int"),
        name: memoryjs.readMemory(processObject.handle, id + name, "string"),
        loggedIn: memoryjs.readMemory(processObject.handle, id + loggedIn, "int"),
        baseExp: memoryjs.readMemory(processObject.handle, id + baseExp, "int"),
        jobExp: memoryjs.readMemory(processObject.handle, id + jobExp, "int"),
        baseLvl: memoryjs.readMemory(processObject.handle, id + baseLvl, "int"),
        jobLvl: memoryjs.readMemory(processObject.handle, id + jobLvl, "int"),
        baseReq: memoryjs.readMemory(processObject.handle, id + baseReq, "int"),
        jobReq: memoryjs.readMemory(processObject.handle, id + jobReq, "int")
    }

    return read;
}

function getPetInfo(id, {name, loyalty, hunger, out}) {
    const read = {
        name: memoryjs.readMemory(processObject.handle, id - name, "string"),
        loyalty: memoryjs.readMemory(processObject.handle, id - loyalty, "int"),
        hunger: memoryjs.readMemory(processObject.handle, id - hunger, "int"),
        out: memoryjs.readMemory(processObject.handle, id - out, "int") > 0 ? true : false
    }

    return read;
}

function getHomunculusInfo(id, {name, loyalty, hunger, exp, required, out}) {
    const read = {
        name: memoryjs.readMemory(processObject.handle, id + name, "string"),
        loyalty: memoryjs.readMemory(processObject.handle, id + loyalty, "int"),
        hunger: memoryjs.readMemory(processObject.handle, id + hunger, "int"),
        exp: memoryjs.readMemory(processObject.handle, id + exp, "int"),
        expReq: memoryjs.readMemory(processObject.handle, id + required, "int"),
        out: memoryjs.readMemory(processObject.handle, id + out, "bool")
    }

    return read;
}

main();