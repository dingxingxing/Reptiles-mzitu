/*
 * @Descripttion: 
 * @version: 
 * @Author: dxiaoxing
 * @Date: 2020-08-26 10:56:29
 * @LastEditors: dxiaoxing
 * @LastEditTime: 2020-08-27 19:37:35
 */
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

// 延迟函数
function wait(mill) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`成功执行延迟函数，延迟：${mill}毫秒`)
    }, mill)
  })
}

let httpUrl = "https://www.mzitu.com/"
// let httpUrl = "http://mzitu.92game.net/"

// 获取页面总页数
async function allPage() {
  let res = await axios.get(httpUrl)
  let $ = cheerio.load(res.data)
  let btnlength = $('.pagination .nav-links .page-numbers').length
  console.log('btnlength:', btnlength);
  let allNum = $('.pagination .nav-links .page-numbers').eq(btnlength - 2).text()
  console.log('allNum:', allNum);
  return allNum
}

allPage()
// 获取当前页面所有链接
async function currentLink() {
  let res = await axios.get(httpUrl)
  let $ = cheerio.load(res.data)
  $('.postlist ul li>a').each((i, element) => {
    let pageurl = $(element).attr('href')
    console.log(pageurl);
    // currentPage(pageurl, i)
  })
}
currentLink()

// 获取二级页面地址和页面总数
async function currentPage(url, i) {
  let res = await axios.get(url)
  let $ = cheerio.load(res.data)
  let title = $('.content .currentpath ').find('a').text()
  title = title.slice(-4)
  console.log(title);
  // let vicetitle = $('.content .main-title').text()
  // console.log(vicetitle);
  let length = $('.pagenavi a').length
  let allNum = $('.pagenavi a').eq(length - 2).text()
  // let imgUrl = $('.main-image p a img').attr('src')
  // console.log('imgUrl:', url);
  fs.mkdir(`./img/${title}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('成功创建目录', title);
    }
  })
  for (let index = 0; index < allNum; index++) {
  wait(900 * i).then(async () => {
    let createTimestamp = parseInt(new Date().getTime() / 1000) + '';
    let res = await axios.get(`${url}/${index}`)
    let $ = cheerio.load(res.data)
    let imgUrl = $('.main-image p a img').attr('src')
    let extName = path.extname(imgUrl)
    let imgPath = `./img/${title}/${createTimestamp}${extName}`
    console.log(imgPath);
  })

  }
}

// 获取图片
// async function download(url, title) {
  // 随机时间戳

  // let ws = fs.createWriteStream(imgPath)
  // axios.get(imgUrl, {responseType: 'stream'}).then(res => {
  //   res.data.pipe(ws)
  //   console.log('图片加载完成:', imgPath);
  // })
// }
