// js/logger.js
export class Logger {
    static COLORS = {
        primary: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3'
    };

    static ASCII_SKULL = `
                 uuuuuuu
             uu$$$$$$$$$$$uu
          uu$$$$$$$$$$$$$$$$$uu
         u$$$$$$$$$$$$$$$$$$$$$u
        u$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$"   "$$$"   "$$$$$$u
       "$$$$"      u$u       $$$$"
        $$$u       u$u       u$$$
        $$$u      u$$$u      u$$$
         "$$$$uu$$$   $$$uu$$$$"
          "$$$$$$$"   "$$$$$$$"
            u$$$$$$$u$$$$$$$u
             u$"$"$"$"$"$"$u
  uuu        $$u$ $ $ $ $u$$       uuu
 u$$$$        $$$$$u$u$u$$$       u$$$$
  $$$$$uu      "$$$$$$$$$"     uu$$$$$$
u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
$$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
 """      ""$$$$$$$$$$$uu ""$"""
           uuuu ""$$$$$$$$$$uuu
  u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$
  $$$$$$$$$$""""           ""$$$$$$$$$$$"
   "$$$$$"                      ""$$$$""
     $$$"                         $$$$"
    `;

    static style(color) {
        return `
            color: ${color};
            font-size: 12px;
            font-weight: bold;
            font-family: monospace;
            padding: 5px;
        `;
    }

    static init() {
        console.clear();
        
        // Skull ASCII art
        console.log('%c' + this.ASCII_SKULL, `
            color: ${this.COLORS.primary};
            font-family: monospace;
            line-height: 1.2;
        `);

        // Uygulama bilgileri
        console.log(
            '%cUnix Radio%c\nGeliştirici: @0x733\nKaynak: github.com/0x733/Unix-Radio',
            `
                color: ${this.COLORS.primary};
                font-size: 24px;
                font-weight: bold;
                font-family: 'Inter', monospace;
                padding: 10px 0;
            `,
            `
                color: ${this.COLORS.info};
                font-size: 14px;
                font-family: monospace;
                padding: 5px 0;
            `
        );

        // Separator
        console.log('%c' + '='.repeat(50), this.style(this.COLORS.primary));

        // Debug bilgileri
        const debugInfo = {
            'User Agent': navigator.userAgent,
            'Platform': navigator.platform,
            'Language': navigator.language,
            'Screen': `${window.screen.width}x${window.screen.height}`,
            'Viewport': `${window.innerWidth}x${window.innerHeight}`,
            'Touch Support': 'ontouchstart' in window,
            'Service Worker': 'serviceWorker' in navigator,
            'Online Status': navigator.onLine
        };

        console.log('%cSystem Info:', this.style(this.COLORS.warning));
        Object.entries(debugInfo).forEach(([key, value]) => {
            console.log(
                `%c${key}: %c${value}`,
                this.style(this.COLORS.info),
                this.style(this.COLORS.success)
            );
        });

        // Separator
        console.log('%c' + '='.repeat(50), this.style(this.COLORS.primary));

        // Easter egg mesajı
        console.log(
            '%cHey! Burayı keşfettiğine göre sen de bir geliştiricisin 🎉\nKoda katkıda bulunmak ister misin?',
            this.style(this.COLORS.success)
        );
    }

    static log(message, type = 'info') {
        const color = this.COLORS[type] || this.COLORS.info;
        console.log(`%c${message}`, this.style(color));
    }

    static error(message) {
        console.error(`%c${message}`, this.style(this.COLORS.error));
    }
}
