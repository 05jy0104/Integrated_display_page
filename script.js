// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有项目卡片
    const projectCards = document.querySelectorAll('.project-card');
    
    // 为每个卡片添加点击事件
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取卡片对应的链接
            const link = this.getAttribute('data-link');
            if (link) {
                // 跳转到对应的网页应用
                window.location.href = link;
            }
        });
        
        // 添加键盘支持
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            }
        });
        
        // 添加图片加载失败的处理
        const img = card.querySelector('.project-image');
        img.addEventListener('error', function() {
            // 如果图片加载失败，使用占位符
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzM0OThkYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+5Y+Y6YeP5Zu+54mHPC90ZXh0Pjwvc3ZnPg==';
            this.alt = '图片加载失败';
        });
    });
    
    // 添加简单的加载动画
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});