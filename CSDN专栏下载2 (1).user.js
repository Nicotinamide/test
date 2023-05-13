// ==UserScript==
// @name         CSDN专栏下载终结版
// @namespace    https://example.com/
// @version      9.0
// @description  CSDN专栏下载终结版
// @author       Logic.Wow!
// @match        https://*.blog.csdn.net/category_*_*
// @match        https://blog.csdn.net/*/category_*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// ==/UserScript==

let done = false;

async function main(userInput) {
    'use strict';
     await createUI();
    console.log("用户输入==",userInput);
    const [username, categoryId] = extractLinkInfo(userInput);
    console.log("username=",username);
    console.log("categoryId=",categoryId);
    // define a function to remove the "试读" tag from the title
    const removeTrialTag = title => title.replace(/<!--####试读-->[\s\S]*?<!--####试读-->/g, '');

    // initialize an empty object to store the article links and titles
    let dist_final = {};

    // define the start and end values of the loop
    //const startValue = 1;
    //const endValue = parseInt(userpage);

    //console.log("endValue==",endValue);
    // define the regex pattern to match article links and titles
    //const pattern = /<li>\s*<a href="(https:\/\/blog\.csdn\.net\/xubenxismile\/article\/details\/\d+)"[\s\S]*?<h2 class="title">\s*([\s\S]*?)\s*<\/h2>/g;
    //const pattern = `<li>\\s*<a href="(https://blog.csdn.net/${username}/article/details/\\d+)"[\\s\\S]*?<h2 class="title">\\s*([\\s\\S]*?)\\s*</h2>`;
    const pattern3 = `<li>\\s*<a href="(https://(\\w+\\.)*csdn\\.net/\\S+/article/details/\\d+)"[\\s\\S]*?<h2 class="title">\\s*([\\s\\S]*?)\\s*(?:<!--#(.*?)#-->)?\\s*</h2>`;
   const pattern = /https:\/\/\w+\.\w+\.csdn\.net\/article\/details\/\d+/g;
    const pattern2 = /https:\/\/\S+?\/article\/details\/\d+/g;
    //const pattern = <li>\\s*<a href="(https?://(www\\.)?blog\\.csdn\\.net/${username}/article/details/(\\d+)|https?://(www\\.)?jokerak\\.blog\\.csdn\\.net/article/details/(\\d+))"\\s*>[\\s\\S]*?<h2 class="title">\\s*([\\s\\S]*?)\\s*</h2>;
    //const pattern = `https://\w+\.blog\.csdn\.net/article/details/\d+`;
    //const pattern = `https://\w+\.blog\.csdn\.net/(?:[^/]+/){2}\d+`;
    //const pattern = /https:\/\/\w+\.blog\.csdn\.net\/.*\/article\/details\/\d+/g;
    //const pattern = /<li>\s*<a href="(https?:\/\/(www\.)?blog\.csdn\.net\/${username}\/article\/details\/(\d+)|https?:\/\/(www\.)?jokerak\.blog\.csdn\.net\/article\/details\/(\d+))"\s*>[\s\S]*?<h2 class="title">\s*([\s\S]*?)\s*<\/h2>/g;
    //console.log(pattern);

    // define a function to merge all the dist dictionaries
    const mergeDist = (dist) => {
        for (const [title, link] of Object.entries(dist)) {
            if (!dist_final[title]) {
                dist_final[title] = link;
            }
        }
    };


    let i = 1;
    let url = "";
    let isright = true;
    // loop through the range of values
    //for (let i = startValue; i <= endValue; i++) {
    while(done != true){
        // create the URL with the current value of i
        //const url = `https://blog.csdn.net/xubenxismile/category_1254150_${i}.html`;
        if (i == 1){
             url = `https://blog.csdn.net/${username}/category_${categoryId}.html`;
            setTimeout( await get_qingqiu(url,pattern,removeTrialTag,mergeDist).catch(()=>{isright=false;}) ,getRandomInt(1000,3000));
            if (isright != true){
             url = `https://${username}.blog.csdn.net/category_${categoryId}.html`;
            }
        }else{
        url = `https://blog.csdn.net/${username}/category_${categoryId}_${i}.html`;
            if (isright != true){
                url = `https://${username}.blog.csdn.net/category_${categoryId}_${i}.html`;
            }
        }
        // initialize an empty object to store the article links and titles
        let dist = {};


        // create a GET request to fetch the page source code
        console.log("开始请求目录");
        setTimeout(
        await get_qingqiu(url,pattern,removeTrialTag,mergeDist).then(response => {console.log("响应response=",response); qingqiu_chuli(response,pattern,pattern2,pattern3,dist,dist_final)})
        ,getRandomInt(1000,3000));
            //console.log("响应response=",response);
        //qingqiu_chuli(response,pattern,dist,i,endValue,dist_final);
        //setTimeout(() => {}, 1000);
        i++;

};

}

async function downloadFile(data, filename) {
    const blob = new Blob([data], { type: "text/html" });
    const filename2 = filename;
    //let delay3 = 2000;
    setTimeout(
    await downloadFile2(data, filename,blob,filename2)
    ,getRandomInt(1000,3000));

}

async function downloadFile2(data, filename,blob,filename2){
    return new Promise((resolve, reject) => {
         GM.xmlHttpRequest({
        url: URL.createObjectURL(blob),
        name: filename,
        responseType: 'blob',
        //onerror: function(error) {
        //    console.error("Download failed with error:", error);
       // }
        onload: function() {
        // 创建一个链接元素用于下载
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename2;
        a.click();
          }
    });
    })
}

function removeExtension(url) {
        // Find the last occurrence of "."
        var index = url.lastIndexOf(".");

        // If there is a "." in the URL and it's not at the beginning or end of the string
        if (index > 0 && index < url.length - 1) {
            // Remove the file extension from the URL
            url = url.substring(0, index);
        }

        // Return the modified URL
        return url;
    }

function removeAds(html) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        if (wrapper.firstChild && wrapper.firstChild.tagName === 'svg') {
            wrapper.removeChild(wrapper.firstChild);
        }
        return wrapper.innerHTML;
    }

function getHtmlWithTemplate(content2,title2,description2) {
    return template
      .replaceAll("[[content]]", content2)
      .replaceAll("[[title]]", title2)
      .replaceAll("[[description]]", description2);
  }

function extractFilename(str) {
  const regex = /\/([^/]+)\.html$/;
  const match = str.match(regex);
  if (match) {
    return match[1] + '.html';
  } else {
    return '';
  }
}

function extractImageLinks(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = [];
        const imgs = doc.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
            const src = imgs[i].getAttribute('src');
            if (src && /\bhttps?:\/\/\S+?\.(?:png|jpe?g|gif)\b/i.test(src)) {
                links.push(src);
            }
        }
        return links;
    }

async function downloadFile_pic(url,filename4) {
        //return fetch(url).then(response => response.blob());
   //return GM.xmlHttpRequest({
        //url: url,
        //responseType: 'blob',
      //});
    let delay4 = 2000;
  setTimeout(
    await GM_download({
  url: url,
  name: filename4,
  onerror: error => {
    console.error('Failed to download image:', error);
  }
}),getRandomInt(1000,3000));
    console.log("url=",url);
    console.log("filename4=",filename4);
    }

function saveBlobAsFile_pic(blob, filename) {
        var link4 = document.createElement('a');
        link4.href = window.URL.createObjectURL(blob);
        link4.download = filename;
        document.body.appendChild(link4);
        link4.click();
        document.body.removeChild(link4);
    }

function replaceImageLinks(html) {
        //const regex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const regex = /<img\s+(?:[^>]*?\s+)?src="([^"]*)"[^>]*>/gi;
        return html.replace(regex, (match, url) => {
            //const filename = url.replace(/^.*[\\\/]/, '');
            //const filename = url.match(/[^\/]+(?=$|$)/)[0];
            try{
            const filename = url.match(/\/([^/?#]+\.(?:jpg|jpeg|png|gif))(?:[\?#]|$)/i)[1];
            const newUrl = `${filename}`;
            return match.replace(url, newUrl);
            }catch(e){
                console.error("当前页面为发现图片链接!","错误提示",e);
            }

        });
    }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function downloadImage_pic(imgUrl, imgName) {
  // 创建一个 <a> 标签，用于触发图片下载
  let link = document.createElement('a');
  link.href = imgUrl;
  link.download = imgName;
  link.target = '_blank';

  // 触发 <a> 标签的点击事件，开始图片下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadImage_pic2(imgUrl, imgName) {
    console.log("开始请求图片链接");
    setTimeout(
   await downloadImage_pic3(imgUrl, imgName)
        ,getRandomInt(1000,3000));
    console.log("图片请求成功");

}

function downloadImage_pic3(imgUrl, imgName){
    return new Promise((resolve, reject) => {
  // 发送 HTTP 请求获取图片二进制数据
  fetch(imgUrl)
    .then(response => response.blob())
    .then(blob => {
      // 创建一个 <a> 标签，并将其 href 属性设置为图片 blob URL
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imgName;

      // 触发 <a> 标签的点击事件，开始图片下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    });
   })
}

async function get_xml_page(link,dist_final){
    console.log("开始请求链接");
    return new Promise((resolve, reject) => {

                           GM_xmlhttpRequest({
                          method: "GET",
                          url: removeExtension(link),
                          onload: function(response) {
                                  // check if the response was successful
                                   if (response.status === 200) {
                                  // get the response source code and save it to a file
                                   let sourceCode = response.responseText;
                                       //console.log(sourceCode);
                                   const $ = window.jQuery || window.$ || null;

                                   if (!$) {
                                             console.error('Error: jQuery is not found.');
                                            return;
                                                   }

                                  const $article = $('<div></div>').html(sourceCode);

                                 // 获取文章内容
                                  let content = removeAds($article.find('#content_views').html());

                                 // 获取文章标题和描述信息
                                  const title = $article.find('.article-title-box h1').text();
                                  const description = $('meta[name="description"]').attr('content');

                                  // use a filename based on the current timestamp
                                  //const filename = new Date().toISOString().split('T')[0] + "_" + link.split('/').slice(-2, -1)[0] + ".html";
                                       console.log("link==",extractFilename(link));
                                    //const filename = link.split('/').slice(-2, -1)[0] + ".html";
                                       const filename = extractFilename(link);

                                 // loop through the keys of dist_final and replace any matching links in the source code
                                   for (const link of Object.values(dist_final)) {
                                             const regex = new RegExp(removeExtension(link), 'g');
                                             if (content.match(regex)) {
                                               content = content.replace(regex, extractFilename(link));
                                                                      }

                                                                 }

                                  // save the source code to a file with the filename
                                       //console.log(content);
                                     const links = extractImageLinks(content);
                                       console.log("当前图片链接links==",links);
                                       for (let i = 0; i < links.length; i++) {
                                               const link3 = links[i];
                                               //const filename2 = link3.replace(/^.*[\\\/]/, '');
                                               //const filename2 = link3.replace(/.*\/(.*)$/, '$1');
                                               const filename2 = link3.match(/[^\/?#]+(?=[?#]|$)/)[0];


                                               //const fullUrl = new URL(link3, url).href;
                                           const fullUrl = links[i];
                                               //const blob2 = downloadFile_pic(fullUrl,`${filename}`);
                                           console.log(filename2);

                                           downloadImage_pic2(fullUrl,`${filename2}`);

                                               //downloadFile_pic(fullUrl,`${filename2}`);
                                               //setTimeout(() => {}, 3000);
                                           //console.log(blob2);
                                               //saveBlobAsFile_pic(blob2, `${filename}`);
                                               //console.log(`Downloaded image ${i+1} of ${links.length}: ${filename}`);
                                                        }
                                   content = replaceImageLinks(content);
                                       //console.log(content);
                                   downloadFile(getHtmlWithTemplate(content,title,description), filename);
                                   resolve();
                                    } else {
                          console.error("Request failed with status:", response.status);
                                        resolve();
                            }
        },
        onerror: function(error) {
            console.error("Request failed with error:", error);
            resolve();
        }
    });
  })
}

async function get_xml_page2(link,dist_final){
    await get_xml_page(link,dist_final)
}

function get_qingqiu(url,pattern,removeTrialTag,mergeDist){
    return new Promise((resolve, reject) => {
       GM_xmlhttpRequest({
            method: "GET",
            url: url,
            //onload: function(response) {},
           onload: function(response) {
        if (response.status >= 200 && response.status < 400) {
          resolve({
            status: response.status,
            statusText: response.statusText,
            headers: response.responseHeaders,
            xml: response.responseXML,
            responseText: response.responseText
          });
        } else {
          reject(new Error("Request failed with status code " + response.status));
            resolve({
            status: response.status,
            statusText: response.statusText,
            headers: response.responseHeaders,
            xml: response.responseXML,
            responseText: response.responseText
          });
        }
      },
            onerror: function(error) {
                console.error("Request failed with error:", error);
            }
        });
        setTimeout(
        //resolve(response)
            getRandomInt(1000,3000));
    });
}

async function qingqiu_chuli(response,pattern,pattern2,pattern3,dist,dist_final){
    //console.log("请求处理函数接到的response=",response);
    const parser = new DOMParser();
//const htmlDoc = parser.parseFromString(htmlString, 'text/html');

    const removeTrialTag = title => title.replace(/<!--####试读-->[\s\S]*?<!--####试读-->/g, '');
    const mergeDist = (dist) => {
        for (const [title, link] of Object.entries(dist)) {
            if (!dist_final[title]) {
                dist_final[title] = link;
            }
        }
    };
                    // check if the response was successful
                if (response.status === 200) {
                    // get the response source code
                    const sourceCode = response.responseText;
                    // use regex to extract all article links and titles
                    //console.log("sourceCode==",sourceCode);
                    const htmlDoc = parser.parseFromString(sourceCode, 'text/html');
                    const allLinks = htmlDoc.querySelectorAll('a[href*="/article/details/"]');
                    let matches3 ;
                    allLinks.forEach(link => {
                    const href = link.href;
                     if (href.match(pattern2)) {
                    // 如果是匹配的链接，则排除属于 "热门文章" 的链接
                   const parents = getAllParents(link);
                   if (!parents.some(node => node.className === 'aside-box')) {
                    console.log("不属于热门文章的链接=",href); // 输出匹配到的链接
                       matches3 = href;
    }else{
        matches3 = null;
    }
  }
});
                    //const matches3 = sourceCode.match(pattern);
                    //说明到最后一页
                    if (matches3 == null){
                        done = true;
                                                // output the final dist object to the console
                        //console.log("Final result:", dist_final);
                        //for (const link of Object.values(dist_final)) {
                       console.log("请求至最后一个目录链接");
                        // create a GET request to fetch the page source code
                        //get_xml_page(link,dist_final,url);
          setTimeout(() => {}, 3000);
          console.log("Final result:", dist_final);
          let cout_d = 1
          console.log("循环value值为=",Object.values(dist_final));
          let link_list = [];
          link_list = Object.values(dist_final);
           //进度条
           const progressBar = document.createElement('div');
           progressBar.style.position = 'fixed';
           progressBar.style.top = '0';
           progressBar.style.left = '0';
           progressBar.style.width = '0';
           progressBar.style.height = '10px';
           progressBar.style.backgroundColor = '#007bff';
           document.body.appendChild(progressBar);

           let count = 0;
           const total = Object.values(dist_final).length;
        for (const link of link_list) {
         // create a GET request to fetch the page source code
         console.log("开始请求逐个链接,当前第",cout_d,"个");
         console.log("当前链接=",link);
         setTimeout(
         await get_xml_page2(link,dist_final)
             ,getRandomInt(1000,3000));
            cout_d++;
            // 更新进度条状态
            count++;
            const percentLoaded = (count / total) * 100;
            progressBar.style.width = percentLoaded + '%';
           }
           // 加载完成后，将进度条显示完整
           progressBar.style.width = '100%';
           // 间隔一定时间后，自动隐藏进度条
           setTimeout(function() {
                         progressBar.style.display = 'none';
              }, 2000);
         generateHtmlFile(dist_final);
         console.log("所有链接请求完成！");
                    }else{
                        console.log("匹配的new_matches_way为:",new_matches_way(sourceCode));
                     const matches = await new_matches_way(sourceCode);
                    console.log("匹配的matches为:",matches);
                    // add the matched links and titles to the dist object
                    for (const match of matches) {
                        const [link, title] = match;
                        dist[title] = link;
                    }
                    // merge the current dist dictionary with the final dist dictionary
                    mergeDist(dist);
                    }

}else{
    console.error("Request failed with status:", response.status);
}
}

function generateHtmlFile(dist4) {
  // Create a new HTML document with header and body elements
  //var html = '<!DOCTYPE html><html><head><title>Dictionary Links</title></head><body>';

  // Loop through the dictionary and add links for each key-value pair
  let html2 = "";
  for (var key in dist4) {
    if (dist4.hasOwnProperty(key)) {
      html2 += '<a href="' + extractFilename(dist4[key]) + '" target="_blank" rel="noopener noreferrer">' + key + '</a><br>';
    }
  }
   let content2 = html2;
   let title2 = "目录";
   let description2 = "目录";
   let filename3 = "目录.html";
downloadFileV2(getHtmlWithTemplate(content2,title2,description2), filename3);
   //await downloadfile_2(getHtmlWithTemplate(content2,title2,description2), filename3);
   alert('专栏下载全部完成!');
  // Close the body and HTML tags
  //html += '</body></html>';

  // Download the HTML file
  //GM_download({
    //url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html),
    //name: 'dictionary_links.html'
  }

async function createUI() {

    // Create the UI elements
  var textBox = document.createElement('input');
  textBox.type = 'text';
  textBox.value = window.location.href;

  const [username, categoryId] = extractLinkInfo(window.location.href);
  var textBox2 = document.createElement('input');
  textBox2.type = 'text';
  //console.log("count_page=",count_page(username, categoryId));
  textBox2.value = "只需点击按钮即可开始下载";

  var button = document.createElement('button');
  button.innerHTML = '开始下载专栏';

  var inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.flexDirection = 'column';

  var textContainer1 = document.createElement('div');
  textContainer1.appendChild(textBox);

  var textContainer2 = document.createElement('div');
  textContainer2.appendChild(textBox2);

  inputContainer.appendChild(textContainer1);
  inputContainer.appendChild(textContainer2);
  inputContainer.appendChild(button);

  // Add styles to position the UI elements in the top-right corner of the viewport (window), even when scrolling
  GM_addStyle(`
    #gm-ui-container {
      position: fixed;
      top: 55px;
      right: 10px;
      z-index: 9999;
    }
  `);

  // Add the UI elements to the page
  var container = document.createElement('div');
  container.id = 'gm-ui-container';
  container.appendChild(inputContainer);
  document.body.appendChild(container);

  // Define a variable to store user input
  var userInput;
  var userpage;
  // Handle button click event
  button.addEventListener('click', function() {
    userInput = textBox.value;
     userpage = textBox2.value;
    console.log('User input:', userInput);
    //return;
    // TODO: Add your script code here
    main(userInput);
  });

  // Update the position of the UI elements when the window is resized or scrolled
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition);

  function updatePosition() {
    var container = document.querySelector('#gm-ui-container');

    // If the container exists, update its position to stay in the top-right corner of the viewport
    if (container) {
      var rect = container.getBoundingClientRect();

      var fixedTop = rect.top;
      var fixedLeft = document.documentElement.clientWidth - rect.width - 10;

      container.style.top = fixedTop + 'px';
      container.style.left = fixedLeft + 'px';
    }
  }
}

function extractLinkInfo(link) {
  //const pattern = /\/(\w+)\/category_(\d+)\.html/;
  //const pattern = /https?:\/\/(\w+)\.blog\.csdn\.net\/category_(\d+)_.*\.html/;
  // const pattern = /https?:\/\/(\w+)\.blog\.csdn\.net\/category_(\d+)\.html/;
    //const pattern = /https?:\/\/(\w+)\.blog\.csdn\.net(?:(?:\/\w+)+)?\/category_(\d+)(?:\.html)?/;
    //const pattern = /https?:\/\/(\w+)\.blog\.csdn\.net.*category_(\d+)(?:_\d+)?\.html/;
    //console.log("放入的link=",link);
    const pattern1 = /https:\/\/blog\.csdn\.net\/(\w+)\/category_(\d+)\.html/;
    const pattern2 = /https:\/\/(\w+)\.blog\.csdn\.net\/category_(\d+)_?.*?\.html?/;
    let matchResult = "";
    if(link.match(pattern1) == null){
   matchResult = link.match(pattern2).slice(1);

    }else{
    matchResult = link.match(pattern1).slice(1);
    }
    console.warn(matchResult);
  if (matchResult) {
    const [username, categoryId] = matchResult;
    return [matchResult[0], matchResult[1]];
  } else {
    return null;
  }
}

function downloadfile_2(html,fn){
 return new Promise((resolve, reject) => {
  // Download the HTML file
  GM_download({
    url: 'data:text/html;charset=utf-8,' + encodeURIComponent(html),
    name:fn
   });
 });

}

async function downloadFileV2(data, filename) {
  const blob = new Blob([data], { type: "text/html" });
  const filename2 = filename;
  const delay = getRandomInt(1000, 3000);

  await new Promise((resolve) => setTimeout(resolve, delay));

  downloadFile3(data, filename,blob,filename2);
}

async function downloadFile3(data, filename,blob,filename2){
    return new Promise((resolve, reject) => {
         GM.xmlHttpRequest({
        url: URL.createObjectURL(blob),
        name: filename,
        responseType: 'blob',
        //onerror: function(error) {
        //    console.error("Download failed with error:", error);
       // }
        onload: function() {
        // 创建一个链接元素用于下载
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = filename2;
        a.click();
          }
    });
    })
}

async function count_page(username, categoryId){
   let url = "";
  const page_all = 0;
  //const url = `https://blog.csdn.net/${username}/category_${categoryId}_${i}.html`;
  const pattern3 = `<li>\\s*<a href="(https://blog.csdn.net/*/article/details/\\d+)"[\\s\\S]*?<h2 class="title">\\s*([\\s\\S]*?)\\s*</h2>`;
  const removeTrialTag = title => title.replace(/<!--####试读-->[\s\S]*?<!--####试读-->/g, '');
  let done = false;
  let i = 1;
  while(done != true) {
  if (i == 1){
            url = `https://blog.csdn.net/${username}/category_${categoryId}.html`;
        }else{
  url = `https://blog.csdn.net/${username}/category_${categoryId}_${i}.html`;
        }
  await get_qingqiu_for_page(url).then(response=>{
                    // get the response source code
                    const sourceCode2 = response.responseText;
                    // use regex to extract all article links and titles
                    //console.log("sourceCode==",sourceCode);
                    //const matches2 = Array.from(sourceCode2.matchAll(pattern3), m => [`${m[1]}.html`, removeTrialTag(m[2])]);
                    const matches2 = sourceCode2.match(pattern3);
                    //console.log("请求源码=",sourceCode2);
                    //console.log("匹配到的==",matches2);
                    if (matches2 == null){
                    done = true;
                                                        }
                    i++;
  })
  }
   return new Promise(resolve => resolve(i - 1));
}

function get_qingqiu_for_page(url){
    return new Promise((resolve, reject) => {
       GM_xmlhttpRequest({
            method: "GET",
            url: url,
            //onload: function(response) {},
           onload: function(response) {
        if (response.status >= 200 && response.status < 400) {
          resolve({
            status: response.status,
            statusText: response.statusText,
            headers: response.responseHeaders,
            xml: response.responseXML,
            responseText: response.responseText
          });
        } else {
          reject(new Error("Request failed with status code " + response.status));
            resolve({
            status: response.status,
            statusText: response.statusText,
            headers: response.responseHeaders,
            xml: response.responseXML,
            responseText: response.responseText
          });
        }
      },
            onerror: function(error) {
                console.error("Request failed with error:", error);
            }
        });
        setTimeout(
        //resolve(response)
            getRandomInt(1000,3000));
    });
}


createUI();

/**
 * 获取指定节点的所有祖先节点
 * @param {Node} node 需要获取其祖先节点的节点
 * @returns {Array} 返回祖先节点数组
 */
function getAllParents(node) {
  const parents = [];
  let parent = node.parentNode;
  while (parent && parent.nodeName !== 'HTML') {
    parents.push(parent);
    parent = parent.parentNode;
  }
  return parents;
}

async function new_matches_way(sourceCode){
    console.log("进入new_matches_way");
const removeTrialTag = title => title.replace(/<!--####试读-->[\s\S]*?<!--####试读-->/g, '');
    // 创建DOM解析器对象
// 创建 DOM 解析器对象，并使用它将 HTML 源代码解析为 DOM 对象
const parser = new DOMParser();
const doc = parser.parseFromString(sourceCode, "text/html");
    console.log("doc=",doc);

// 获取包含文章链接和标题的元素列表
const articleElements = doc.querySelector("#column .column_article_list").children;
    //console.log("articleElements=",articleElements);

// 遍历列表，提取出链接和标题
const matches = [];
for (let i = 0; i < articleElements.length; i++) {
  const articleElement = articleElements[i];
  const link = articleElement.querySelector("a").href + ".html";
    console.log("articleElementslink=",link);
  const titleElement = articleElement.querySelector(".column_article_title h2.title");
    console.log("titleElement=",titleElement);
    let title = "";
  if (titleElement) {
      try{
     title = removeTrialTag(titleElement.innerText.trim());
      }catch{
     title = titleElement.innerText.trim();
      }
    matches.push([link, title]);
    //console.log("articleElementsmatches=",matches);
  } else {
    console.warn("无法从该元素中提取文章标题", articleElement);
  }
}
    return matches;
}

const template = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- title -->
  <title>[[title]]</title>
  <!-- meta -->
  <meta name="keywords" content="[[title]]">
  <meta name="description" content="[[description]]">
  <link rel="stylesheet" href="https://stackedit.io/style.css" />
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <style>
    .article-title {
      text-align: center;
    }
    .prettyprint {
      position: relative;
      background-color: #282c34;
      margin: 0 0 24px;
      padding: 8px 16px 6px 56px;
      line-height: 22px;
    }

    .prettyprint .pre-numbering {
      word-wrap: normal;
      word-break: break-all;
      position: absolute;
      width: 48px;
      top: 0;
      left: 0;
      margin: 0;
      padding: 8px 0;
      list-style: none;
      text-align: right;
      font-size: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .prettyprint .pre-numbering li {
      color: #abb2bf !important;
      border-right: 1px solid #c5c5c5;
      padding: 0 8px;
    }

    .prettyprint code,
    .prettyprint .prism {
      color: #abb2bf !important;
      padding: 0;
    }
  </style>
  <script>
    $(() => {
      // 添加prettyprint类名
      $('pre').addClass('prettyprint')
      // 添加行号
      $('pre').each((index, preDom) => {
        const codeHeight = parseInt($(preDom).find('code').css('height'))
        const codeLineHeight = parseInt($(preDom).find('code').css('lineHeight'))
        const lines = Math.ceil(codeHeight / codeLineHeight)
        let appendString = \`<ul class="pre-numbering">\n\`
        for (let i = 1; i <= lines; i++) {
          appendString += \`<li>\${i}</li>\n\`
        }
        appendString += \`</ul>\`
        $(preDom).append(appendString)
      })
    })
  </script>
</head>

<body class="stackedit">
  <div class="stackedit__html">
    <!-- 标题 -->
    <h1 class="article-title">[[title]]</h1>
    <!-- 内容 -->
    [[content]]
  </div>
</body>

</html>
`;