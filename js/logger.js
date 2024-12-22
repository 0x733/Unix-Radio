// js/logger.js
export class Logger {
    static COLORS = {
        primary: '#2196f3',
        success: '#4caf50',
        warning: '#ff9800',
        error: '#f44336',
        info: '#2196f3',
        debug: '#9c27b0',
        trace: '#607d8b'
    };

    static LOG_LEVELS = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
        TRACE: 4
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

    static #currentLogLevel = Logger.LOG_LEVELS.INFO;
    static #isProduction = process.env.NODE_ENV === 'production';
    static #startTime = performance.now();
    static #isInitialized = false;
    static #errorCount = 0;
    static #maxErrorCount = 100;

    static #setupGlobalErrorHandler() {
        window.addEventListener('error', (event) => {
            this.error('Uncaught Error:', event.error);
            event.preventDefault();
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.error('Unhandled Promise Rejection:', event.reason);
            event.preventDefault();
        });
    }

    static style(color, extraStyles = {}) {
        return Object.entries({
            color: color,
            'font-size': '12px',
            'font-weight': 'bold',
            'font-family': 'monospace',
            padding: '5px',
            ...extraStyles
        }).map(([key, value]) => `${key}: ${value}`).join(';');
    }

    static setLogLevel(level) {
        try {
            if (typeof level === 'string' && this.LOG_LEVELS[level.toUpperCase()] !== undefined) {
                this.#currentLogLevel = this.LOG_LEVELS[level.toUpperCase()];
            } else {
                throw new Error('Invalid log level');
            }
        } catch (error) {
            this.error('Failed to set log level:', error);
        }
    }

    static init(options = {}) {
        try {
            if (this.#isInitialized && !options.reinit) {
                this.warn('Logger already initialized. Use reinit option to force initialization.');
                return;
            }

            if (this.#isProduction && !options.forceInit) {
                return;
            }

            console.clear();
            this.#setupGlobalErrorHandler();
            this.#startTime = performance.now();

            console.log('%c' + this.ASCII_SKULL, this.style(this.COLORS.primary, {
                'line-height': '1.2'
            }));

            console.log(
                '%cUnix Radio%c\nGeliştirici: @0x733\nKaynak: github.com/0x733/Unix-Radio',
                this.style(this.COLORS.primary, {
                    'font-size': '24px',
                    'padding': '10px 0'
                }),
                this.style(this.COLORS.info, {
                    'font-size': '14px',
                    'padding': '5px 0'
                })
            );

            this.#logSystemInfo();
            this.#checkBrowserAPIs();

            this.#isInitialized = true;
            this.success('Logger initialized successfully');
        } catch (error) {
            console.error('Failed to initialize logger:', error);
        }
    }

    static #logSystemInfo() {
        try {
            const debugInfo = {
                'User Agent': navigator.userAgent,
                'Platform': navigator.platform,
                'Language': navigator.language,
                'Screen': `${window.screen.width}x${window.screen.height}`,
                'Viewport': `${window.innerWidth}x${window.innerHeight}`,
                'Touch Support': 'ontouchstart' in window,
                'Service Worker': 'serviceWorker' in navigator,
                'Online Status': navigator.onLine,
                'Memory': this.#getMemoryInfo(),
                'Performance': this.#getPerformanceMetrics()
            };

            this.group('System Information');
            Object.entries(debugInfo).forEach(([key, value]) => {
                this.info(`${key}: ${value}`);
            });
            this.groupEnd();
        } catch (error) {
            this.error('Failed to log system info:', error);
        }
    }

    static #checkBrowserAPIs() {
        try {
            const apis = {
                'WebGL': () => !!window.WebGLRenderingContext,
                'WebAssembly': () => typeof WebAssembly === 'object',
                'SharedWorker': () => 'SharedWorker' in window,
                'WebRTC': () => 'RTCPeerConnection' in window,
                'Bluetooth': () => 'bluetooth' in navigator,
                'Battery': () => 'getBattery' in navigator,
                'Geolocation': () => 'geolocation' in navigator,
                'WebSocket': () => 'WebSocket' in window,
                'LocalStorage': () => 'localStorage' in window,
                'IndexedDB': () => 'indexedDB' in window
            };

            this.group('API Support');
            Object.entries(apis).forEach(([api, check]) => {
                try {
                    const supported = check();
                    this.info(`${api}: ${supported ? '✓' : '✗'}`);
                } catch {
                    this.info(`${api}: ✗ (check failed)`);
                }
            });
            this.groupEnd();
        } catch (error) {
            this.error('Failed to check browser APIs:', error);
        }
    }

    static #getMemoryInfo() {
        try {
            if (performance.memory) {
                const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
                return `${Math.round(usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(jsHeapSizeLimit / 1024 / 1024)}MB`;
            }
            return 'Not available';
        } catch {
            return 'Access denied';
        }
    }

    static #getPerformanceMetrics() {
        try {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                return `Load: ${Math.round(navigation.loadEventEnd)}ms`;
            }
            return 'Not available';
        } catch {
            return 'Measurement failed';
        }
    }

    static #getTimestamp() {
        return new Date().toISOString().split('T')[1].split('.')[0];
    }

    static #getStackTrace() {
        try {
            const stack = new Error().stack;
            return stack ? stack.split('\n')[3].trim() : '';
        } catch {
            return 'Stack trace unavailable';
        }
    }

    static #shouldLog(level) {
        return this.#currentLogLevel >= this.LOG_LEVELS[level] && this.#errorCount < this.#maxErrorCount;
    }

    static log(message, type = 'info') {
        if (!this.#shouldLog('INFO')) return;
        const timestamp = this.#getTimestamp();
        const color = this.COLORS[type] || this.COLORS.info;
        console.log(`%c[${timestamp}] ${message}`, this.style(color));
    }

    static success(message) {
        this.log(message, 'success');
    }

    static info(message) {
        this.log(message, 'info');
    }

    static warn(message) {
        if (!this.#shouldLog('WARN')) return;
        console.warn(`%c[WARN] ${message}`, this.style(this.COLORS.warning));
    }

    static error(message, error) {
        if (!this.#shouldLog('ERROR')) return;
        this.#errorCount++;
        
        const errorMessage = error instanceof Error ? error.message : error;
        const stackTrace = error instanceof Error ? error.stack : this.#getStackTrace();
        
        console.error(
            `%c[ERROR] ${message}\n${errorMessage}\n${stackTrace}`,
            this.style(this.COLORS.error)
        );

        if (this.#errorCount >= this.#maxErrorCount) {
            console.error('%cMaximum error count reached. Further errors will be suppressed.', 
                this.style(this.COLORS.error));
        }
    }

    static debug(message) {
        if (!this.#shouldLog('DEBUG')) return;
        const trace = this.#getStackTrace();
        console.debug(`%c[DEBUG] ${message}\n${trace}`, this.style(this.COLORS.debug));
    }

    static trace(message) {
        if (!this.#shouldLog('TRACE')) return;
        console.trace(`%c[TRACE] ${message}`, this.style(this.COLORS.trace));
    }

    static group(label) {
        console.group(`%c${label}`, this.style(this.COLORS.primary));
    }

    static groupEnd() {
        console.groupEnd();
    }

    static performance(label) {
        const elapsed = performance.now() - this.#startTime;
        this.log(`${label}: ${elapsed.toFixed(2)}ms`, 'info');
    }

    static table(data, columns) {
        try {
            if (data && typeof data === 'object') {
                console.table(data, columns);
            } else {
                throw new Error('Invalid data for table');
            }
        } catch (error) {
            this.error('Failed to display table:', error);
        }
    }

    static checkMemoryLeaks() {
        try {
            if (performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                const total = performance.memory.jsHeapSizeLimit;
                const percentUsed = (used / total) * 100;
                
                if (percentUsed > 90) {
                    this.warn(`High memory usage detected: ${percentUsed.toFixed(2)}%`);
                }
            }
        } catch (error) {
            this.error('Failed to check memory leaks:', error);
        }
    }
}