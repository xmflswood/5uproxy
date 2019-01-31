const fs = require('fs')
const request = require('request-promise')
let url = 'http://m.yuetengzs.com/Votephoto/addVote.html'
const ls = JSON.parse(fs.readFileSync('./list.json'))
let temp = JSON.parse(fs.readFileSync('./temp.json'))
if (temp.length === 0) {
  temp = ls;
  fs.writeFileSync('./temp.json', JSON.stringify(temp))
}
success = 0
let r = []
async function test() {
  for (let i = temp.length; i > 0; i--) {
    console.log('剩余' + temp.length)
    let t = false
    try {
      t = await check(temp[i])
    } catch(e) {
     console.log(e)
    }
    
    console.log(t)
    if (t) {
       r.push(temp[i])
    }
    temp.splice(0, 1)
    i--;
    fs.writeFileSync('./temp.json', JSON.stringify(temp))
  }
  console.log(r)
  fs.writeFileSync('./result.json', JSON.stringify(r))
}
// test()
function check(s) {
  console.log(s)
  s = 'http://' + s
  let timeout = 5000
  let opt = {
    proxy: s,
    method: 'POST',
    url: url,
    timeout: timeout,
    formData: {
      id: 76
    }
  }
  return new Promise((resolve, reject) => {
   let flag = false
   request(opt).then(
    (res) => {
     if (JSON.parse(res).status === 1) {
       success++
       console.log(`成功刷票${success}次`)
     } 
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
     if (!flag) {
       resolve(false)
     }
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
async function testt () {
  let a = await check('139.199.181.200:8080')
  console.log(a)
}
test()
