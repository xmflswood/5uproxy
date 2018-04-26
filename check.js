const fs = require('fs')
const request = require('request-promise')
let url = 'https://www.baidu.com'
const ls = JSON.parse(fs.readFileSync('./result.json'))
let r = []
async function test() {
  for (let i = 0; i < ls.length; i ++) {
    console.log((i + 1) + '/' + ls.length)
    let t = await check(ls[i])
    console.log(t)
    if (t) {
       r.push(ls[i])
    }
  }
  console.log(r)
  fs.writeFileSync('./result.json', JSON.stringify(r))
}
test()
function check(s) {
  s = 'http://' + s
  let timeout = 5000
  console.log(s)
  let opt = {
    proxy: s,
    method: 'GET',
    url: url,
    timeout: timeout
  }
  return new Promise((resolve, reject) => {
   let flag = false
   request(opt).then(
    (res) => { 
     flag = true
     resolve(true)
    }
   ).catch(
    (e) => {
      flag = true
      resolve(false)
    }
   )
   setTimeout(() => {
     if (!flag) resolve(false)
   }, timeout)
  })
  
}
function freezeTime(t) {
  return new Promise((resolve, reject) => {
   setTimeout(() => {
    resolve(true)
   }, t)
  })
}

function getProxy(s) {
  let i = s.indexOf(':')
  return {
    host: s.substring(0, i),
    port: +s.substring(i+1)
  }
}
