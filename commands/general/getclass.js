const puppeteer = require('puppeteer');

module.exports = {
    name: "getclass",
    description: `Gets a class. If no search parameter is given, then if the search parameter has a space, then use enclose it in single or double quotes. 
    Please be as specific as possible with the class name because only giving a single letter sometimes does not change the results at all.`,
    usage: "<prefix>getclass '<search parameter>'",
    usesDB: false,
    async execute(message, args, prefix) {
        const url = 'https://www.sjsu.edu/classes/schedules/spring-2021.php';
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto(url);

        // Using page.click() doesn't work as great because puppeteer will try to scroll down to the element
        // https://stackoverflow.com/questions/57939222/puppeteer-throws-error-with-node-not-visible
        await page.evaluate(() => {
            document.querySelector("#btnLoadTable").click();
        });

        if (args[0]) {
            await page.type('#classSchedule_filter > label > input[type=search]', args.join(" "));
        }

        // Okay really need to figure how to do it without screenshot
        await page.waitForSelector('#classSchedule');          // wait for the selector to load
        const element = await page.$('#classSchedule');
        await element.screenshot({ path: 'classSchedule.png'});

        // This is if I want to actually grab the individual rows of classes, but not needed for now
        // const items_selector = '#classSchedule';
        // const itemArray = await page.$$eval(items_selector, items => items.map(item => item.innerText));
        // const split = itemArray[0].split('\n');
        // const splitObject = split.map((item, index) => new Object({name: index, value: item}));
        
        message.channel.send({files: ["classSchedule.png"]});

        await browser.close();
    }
}