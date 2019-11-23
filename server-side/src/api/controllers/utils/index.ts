export const sortOutData = rawData => {
    const id = rawData["id"];
    const profile = {
      weight: rawData["weight"],
      height: rawData["height"],
      abilities: rawData["abilities"].map(ability => ability["ability"])
    };
    const held_items = rawData["held_items"].map(item => item["item"]);
    const stats = rawData["stats"].map(stat => ({
      name: stat["stat"]["name"],
      value: stat["base_stat"]
    }));
    const sprite = rawData["sprites"]["front_default"];
    const name = rawData["name"];
    const types = rawData["types"].map(type => type["type"]);
  
    return {
      id,
      profile,
      held_items,
      stats,
      sprite,
      name,
      types
    };
};