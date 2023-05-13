// ==UserScript==
// @name          Download Page
// @version       1.0
// @description   Download the current webpage as a file.
// @match         *://*/*
// @grant         none
// ==/UserScript==

(function() {
    'use strict';
  
      function downloadPage() {
          const htmlContent = document.documentElement.outerHTML;
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${document.title}.pdf`;
          link.click();
      }
  
  
  

      
  
      async function getLinks() {
        const pageNumber = Math.ceil(listTotal / pageSize);
        const links = new Set();
      
        const fetchPromises = [];
        for (let i = 1; i <= pageNumber; i++) {
          const url = `https://blog.csdn.net/${username}/category_${SharecolumnId}_${i}.html`;
          const fetchPromise = fetch(url)
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const mainElement = doc.querySelector('main');

              if (!mainElement) {
                throw new Error('No <main> element found');
              }

              const anchorElements = mainElement.querySelectorAll('a');
      
              // 遍历所有链接
              anchorElements.forEach(anchor => {
                const href = anchor.href;
                const targetString = `${username}/article/details/`;
                if (href.includes(targetString) && !href.includes('#comments_')) {
                  links.add(href);
                }
                // 在这里可以对获取到的链接进行处理
              });
            })
            .catch(error => {
              console.error('发生错误:', error);
              // 在这里可以处理错误情况
            });
      
          fetchPromises.push(fetchPromise);
        }
      
        await Promise.all(fetchPromises);
      
        return Array.from(links);
      }
      

  
  
  
  
  
  
      function createDownloadButton() {
          const downloadButton = document.createElement('button');
          downloadButton.textContent = 'Download Page';
          downloadButton.style.position = 'fixed';
          downloadButton.style.bottom = '10px';
          downloadButton.style.right = '20px';
          downloadButton.style.zIndex = '9999';
          downloadButton.addEventListener('click', downloadPage);
          document.body.appendChild(downloadButton);
      }
  createDownloadButton();
  })();