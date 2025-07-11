/**
 * Internationalization (i18n) Manager for 8-Puzzle Solver
 * Provides Turkish/English language support with modern standards
 */

var I18n = {
    // Current locale configuration
    currentLocale: 'tr',
    fallbackLocale: 'en',
    
    // Translation storage
    translations: {},
    
    // Supported locales
    supportedLocales: ['tr', 'en'],
    
    // Number and date formatters
    formatters: {},
    
    /**
     * Initialize i18n system
     */
    init: function() {
        this.loadSavedLanguage();
        this.setupFormatters();
        this.loadTranslations();
        this.setupLanguageChangeListener();
        // Apply translations immediately after initialization
        this.updatePageContent();
    },
    
    /**
     * Load saved language preference from localStorage
     */
    loadSavedLanguage: function() {
        var savedLang = localStorage.getItem('8puzzle-language');
        if (savedLang && this.supportedLocales.includes(savedLang)) {
            this.currentLocale = savedLang;
        } else {
            // Auto-detect browser language
            var browserLang = navigator.language.split('-')[0];
            if (this.supportedLocales.includes(browserLang)) {
                this.currentLocale = browserLang;
            }
        }
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLocale;
        
        // Update language selector if exists
        var langSelector = document.getElementById('languageSelector');
        if (langSelector) {
            langSelector.value = this.currentLocale;
        }
    },
    
    /**
     * Setup number and date formatters for current locale
     */
    setupFormatters: function() {
        this.formatters = {
            number: new Intl.NumberFormat(this.currentLocale),
            decimal: new Intl.NumberFormat(this.currentLocale, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            }),
            time: new Intl.DateTimeFormat(this.currentLocale, { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }),
            date: new Intl.DateTimeFormat(this.currentLocale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    },
    
    /**
     * Load translations for current and fallback locales
     */
    loadTranslations: function() {
        // Load current locale translations
        if (window.Translations && window.Translations[this.currentLocale]) {
            this.translations[this.currentLocale] = window.Translations[this.currentLocale];
        }
        
        // Load fallback locale translations
        if (window.Translations && window.Translations[this.fallbackLocale] && 
            this.currentLocale !== this.fallbackLocale) {
            this.translations[this.fallbackLocale] = window.Translations[this.fallbackLocale];
        }
    },
    
    /**
     * Setup language change event listener
     */
    setupLanguageChangeListener: function() {
        var langSelector = document.getElementById('languageSelector');
        if (langSelector) {
            langSelector.addEventListener('change', function() {
                I18n.changeLanguage(langSelector.value);
            });
        }
    },
    
    /**
     * Change current language
     * @param {string} locale - Target locale code
     */
    changeLanguage: function(locale) {
        if (!this.supportedLocales.includes(locale)) {
            console.warn('Unsupported locale:', locale);
            return;
        }
        
        this.currentLocale = locale;
        localStorage.setItem('8puzzle-language', locale);
        document.documentElement.lang = locale;
        
        this.setupFormatters();
        this.loadTranslations();
        this.updatePageContent();
        
        // Trigger custom event for other components to listen
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { locale: locale } 
        }));
    },
    
    /**
     * Get translated string
     * @param {string} key - Translation key (dot notation supported)
     * @param {Object} params - Parameters for interpolation
     * @returns {string} Translated string
     */
    t: function(key, params) {
        params = params || {};
        
        var translation = this.getTranslation(key, this.currentLocale) || 
                         this.getTranslation(key, this.fallbackLocale) || 
                         key;
        
        // Handle interpolation
        return this.interpolate(translation, params);
    },
    
    /**
     * Get translation from specific locale
     * @param {string} key - Translation key
     * @param {string} locale - Target locale
     * @returns {string|null} Translation or null if not found
     */
    getTranslation: function(key, locale) {
        if (!this.translations[locale]) return null;
        
        var keys = key.split('.');
        var translation = this.translations[locale];
        
        for (var i = 0; i < keys.length; i++) {
            if (translation && typeof translation === 'object') {
                translation = translation[keys[i]];
            } else {
                return null;
            }
        }
        
        return typeof translation === 'string' ? translation : null;
    },
    
    /**
     * Interpolate parameters into translation string
     * @param {string} text - Text with placeholders
     * @param {Object} params - Parameters to interpolate
     * @returns {string} Interpolated string
     */
    interpolate: function(text, params) {
        if (!text || typeof text !== 'string') return text;
        
        return text.replace(/\{\{(\w+)\}\}/g, function(match, key) {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    },
    
    /**
     * Format number according to current locale
     * @param {number} num - Number to format
     * @param {string} type - Format type (number, decimal)
     * @returns {string} Formatted number
     */
    formatNumber: function(num, type) {
        type = type || 'number';
        var formatter = this.formatters[type] || this.formatters.number;
        return formatter.format(num);
    },
    
    /**
     * Format time according to current locale
     * @param {Date} date - Date object to format
     * @param {string} type - Format type (time, date)
     * @returns {string} Formatted time/date
     */
    formatTime: function(date, type) {
        type = type || 'time';
        var formatter = this.formatters[type] || this.formatters.time;
        return formatter.format(date);
    },
    
    /**
     * Update all page content with current language
     */
    updatePageContent: function() {
        // Update elements with data-i18n attribute
        var i18nElements = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < i18nElements.length; i++) {
            var element = i18nElements[i];
            var key = element.getAttribute('data-i18n');
            var translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
        
        // Update optgroup labels with data-i18n-optgroup attribute
        var optgroupElements = document.querySelectorAll('[data-i18n-optgroup]');
        for (var i = 0; i < optgroupElements.length; i++) {
            var element = optgroupElements[i];
            var key = element.getAttribute('data-i18n-optgroup');
            var translation = this.t(key);
            element.label = translation;
        }
        
        // Update elements with data-i18n-html attribute (for HTML content)
        var i18nHtmlElements = document.querySelectorAll('[data-i18n-html]');
        for (var i = 0; i < i18nHtmlElements.length; i++) {
            var element = i18nHtmlElements[i];
            var key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        }
        
        // Update aria-label attributes
        var ariaElements = document.querySelectorAll('[data-i18n-aria]');
        for (var i = 0; i < ariaElements.length; i++) {
            var element = ariaElements[i];
            var key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        }
        
        // Update title attributes
        var titleElements = document.querySelectorAll('[data-i18n-title]');
        for (var i = 0; i < titleElements.length; i++) {
            var element = titleElements[i];
            var key = element.getAttribute('data-i18n-title');
            element.setAttribute('title', this.t(key));
        }
    },
    
    /**
     * Get current locale
     * @returns {string} Current locale code
     */
    getCurrentLocale: function() {
        return this.currentLocale;
    },
    
    /**
     * Check if locale is RTL
     * @param {string} locale - Locale to check (optional, uses current if not provided)
     * @returns {boolean} True if RTL
     */
    isRTL: function(locale) {
        locale = locale || this.currentLocale;
        var rtlLocales = ['ar', 'he', 'fa', 'ur'];
        return rtlLocales.includes(locale);
    },
    
    /**
     * Pluralization helper
     * @param {number} count - Number for pluralization
     * @param {string} key - Base translation key
     * @returns {string} Pluralized translation
     */
    plural: function(count, key) {
        var pluralKey = key + (count === 1 ? '_one' : '_other');
        return this.t(pluralKey, { count: count });
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        I18n.init();
    });
} else {
    I18n.init();
}

// Global alias for convenience
window.t = function(key, params) {
    return I18n.t(key, params);
};