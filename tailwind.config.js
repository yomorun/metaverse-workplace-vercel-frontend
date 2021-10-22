module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true
    },
    purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        screens: {
            '2xl': { 'max': '1535px' },
            'xl': { 'max': '1279px' },
            'lg': { 'max': '1023px' },
            'md': { 'max': '767px' },
            'sm': { 'max': '639px' },
        },
        extend: {
            backgroundImage: theme => ({
                'check-point': "url('/check-point/icon-bg.png')",
            })
        }
    }
}
