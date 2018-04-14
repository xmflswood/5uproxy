const puppetter = require('puppeteer')
puppetter.launch({headless: false}).then(async browser => {
  let page = await browser.newPage()
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
})

function sleepTime(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, t);
  })
}
