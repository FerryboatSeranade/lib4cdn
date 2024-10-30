// 创建图片替换函数
function replaceImgLinks(element) {
  const imgRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/gi;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  
  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent;
    const matches = text.match(imgRegex);
    
    if (matches) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      
      matches.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '20vw';
        img.style.height = 'auto';
        
        const index = text.indexOf(url, lastIndex);
        if (index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
        }
        fragment.appendChild(img);
        lastIndex = index + url.length;
      });
      
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      
      node.parentNode.replaceChild(fragment, node);
    }
  }
}

// 创建观察器实例
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    // 处理新增的节点
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        replaceImgLinks(node);
      }
    });
    
    // 处理修改的节点
    if (mutation.type === 'characterData') {
      replaceImgLinks(mutation.target.parentNode);
    }
  });
});

// 获取目标节点
const target = document.querySelector('.system-notice');
if (target) {
  // 配置观察选项
  const config = { 
    childList: true, // 观察子节点的变化
    subtree: true,   // 观察所有后代节点
    characterData: true // 观察文本内容的变化
  };

  // 开始观察
  observer.observe(target, config);
  
  // 初始处理现有内容
  replaceImgLinks(target);
}

// 清理函数 (如果需要停止观察)
// observer.disconnect();
