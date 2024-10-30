function observeTextChanges() {
  // 处理文本节点的函数
  function processTextNode(node) {
    const imgRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/gi;
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

  // 定期检查所有文本节点
  setInterval(() => {
    const target = document.querySelector('.system-notice');
    if (!target) return;

    const walker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      processTextNode(node);
    }
  }, 1000); // 每秒检查一次
}

// 启动监控
observeTextChanges();
