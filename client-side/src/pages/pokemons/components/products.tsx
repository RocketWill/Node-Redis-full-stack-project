import React, { Component } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';

const axios = require('axios');
const { Search } = Input;

class Products extends Component<any, any> {
    componentDidMount() {
        axios.get('https://pokeapi.co/api/v2/pokemon/pikachu/')
            .then((res: any) => {
                console.log(res.data);
                const { dispatch } = this.props;
                // dispatch({
                //     type: 'products/save',
                //     payload: res.data,
                // });
            })
    }
    render() {
        return (
            <div>
                <Search
                    placeholder="input search text"
                    enterButton="Search"
                    size="large"
                    onSearch={value => console.log(value)}
                />
            </div>
        );
    }
}

export default connect(({ products }) => ({
    products,
}))(Products);
