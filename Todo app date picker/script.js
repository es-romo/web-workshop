const themes = [
    {
        name: 'Blumine',
        bg: '#1e5f74'
    },
    {
        name: 'Mortar',
        bg: '#4b3a50'
    },
    {
        name: 'Dark',
        bg: '#Mine Shaft'
    }
]


class Theme{
    constructor(name, bg){
        this.name = name
        this.bg = bg
    }
    render(){
        const theme = document.createElement('div')
        theme.className = 'theme-selector selected'
        theme.style.backgroundColor = this.bg
        return theme
    }
}

const themePicker = document.getElementById("themeCarousel")

themes.forEach(theme => {
   themePicker.appendChild(new Theme(theme.name, theme.bg).render()) 
});

function handleClick(){
    let themeCarousel = document.getElementById("themeCarousel")
    themeCarousel.style.display = "none"
}