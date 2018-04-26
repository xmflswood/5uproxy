const puppetter = require('puppeteer')
const fs = require('fs')
const schedule = require('node-schedule')
function getNewList() {
  return new Promise((resolve, reject) => {
    puppetter.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async browser => {
      let page = await browser.newPage()
      
      await page.setRequestInterception(true);
page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
});
    await page.goto('http://www.data5u.com/')
      page.waitForSelector('.port')
      // await sleepTime(1000)
      let proxyList = await page.evaluate(() => {
        let list = [...document.querySelectorAll('.l2')]
        return list.map((i) => {
          return `${i.querySelector('li').innerText}:${i.querySelector('.port').innerText}`
        })
      })
      console.log(proxyList)
      browser.close()
      resolve(proxyList)
    })
  })
}
async function main() {
  let a = await getNewList()
  addToList(a)
}

function sleepTime(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, t);
  })
}

function addToList(newList) {
  if (!newList || !newList.length) return
  let oldList = JSON.parse(fs.readFileSync('./list.json'))
  let map = {}
  for (let i = 0; i < oldList.length; i += 1) {
    map[oldList[i]] = 1
  }
  newList.forEach(i => {
    if (!map[i]) {
      oldList.push(i)
    }
  })
  fs.writeFileSync('./list.json', JSON.stringify(oldList))
}
main()
var rule = new schedule.RecurrenceRule()
rule.minute = [0, 10, 20, 30, 40, 50]
rule.second = 0
schedule.scheduleJob(rule, () => {
  console.log(new Date())
  main()
})
