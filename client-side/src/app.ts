export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
    initialState: {
      pokemons: [{ name: 'dva', id: 1 }, { name: 'antd', id: 2 }],
    },
  },
};
