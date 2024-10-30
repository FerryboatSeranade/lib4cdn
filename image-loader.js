// image-loader.js
(function() {
    // 创建一个函数来处理图片链接转换
    function convertImageLinks() {
        document.querySelectorAll('.system-notice *').forEach(el => {
            const text = el.textContent;
            const imgRegex = /https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/gi;
            const matches = text.match(imgRegex);
            
            if (matches) {
                matches.forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.width = '20vw';
                    img.style.height = 'auto';
                    el.innerHTML = el.innerHTML.replace(url, img.outerHTML);
                });
            }
        });
    }

    // 创建一个观察器来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                // 检查是否有新增的.system-notice元素
                const hasSystemNotice = Array.from(mutation.addedNodes).some(node => {
                    return node.classList && node.classList.contains('system-notice') ||
                           (node.querySelectorAll && node.querySelectorAll('.system-notice').length > 0);
                });
                
                if (hasSystemNotice) {
                    convertImageLinks();
                }
            }
        });
    });

    // 当DOM加载完成后开始监视
    document.addEventListener('DOMContentLoaded', () => {
        // 首次运行转换
        convertImageLinks();
        
        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
