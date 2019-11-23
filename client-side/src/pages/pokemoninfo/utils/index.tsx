export const colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];

const randomIntFromInterval = (min: number, max: number) => (  
     Math.floor(Math.random() * (max - min + 1) + min)
 )
export const getRandomColors = () => {
    return colors[randomIntFromInterval(0, 10)];
}

export const typesColors = {
    normal: "lightgrey",
    water: "blue",
    electric: "gold",
    fighting: "volcano",
    ground: "darksalmon",
    psychic: "magenta",
    rock: "lightgrey",
    dark: "geekblue",
    steel: "blue",
    fire: "red",
    grass: "green",
    ice: "cyan",
    poison: "purple",
    flying: "orange",
    bug: "lime",
    ghost: "purple",
    dragon: "gold",
    fairy: "volcano"
}