import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';

const { Meta } = Card;
const axios = require('axios');

class RandomPokemons extends Component<any, any> {
    state = {
        pokemonsList: []
    }
    componentDidMount() {
        axios.get('http://localhost:3000/api/v1/random-pokemons')
            .then(res => res.data)
            .then(res => {
                this.setState({ pokemonsList: res })
                const { dispatch } = this.props;
                dispatch({
                    type: 'pokemons/save',
                    payload: res,
                });
            })
    }

    displayCards = (data: any[]) => {
        // if(!data) return;
        data.map((d: any) => {
            console.log(d.sprite)
            return (
                <Col span={6}>
                    <Card
                        hoverable={true}
                        style={{ width: 240 }}
                        cover={<img alt={d.name} src={d.sprite} />}
                    >
                        <Meta title={d.name} description={d.id} />
                    </Card>
                </Col>
            );
        })
    }

    render() {
        const { pokemonsList } = this.state;
        console.log(pokemonsList)
        return (
            <div>
                <Row type="flex">
                    {pokemonsList.map(d => (
                        <Col span={6}>
                            <Card
                                hoverable={true}
                                style={{ width: 290, marginBottom: 30 }}
                                cover={<img alt={d.name} src={d.sprite} />}
                            >
                                <Meta title={d.name} description={d.id} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }
}

export default connect(({ pokemons }) => ({
    pokemons,
}))(RandomPokemons);
