import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import { PokemonInfo as IPokemonInfo } from '../../data.d';
import Link from 'umi/link';
import router from 'umi/router';
import style from '../index.css';

const { Meta } = Card;
const axios = require('axios');

interface IState {
    pokemonsList: IPokemonInfo[]
}

interface IPropsState {
    pokemons: {
        pokemonsList: IPokemonInfo[]
    }
}

interface IProps {
    dispatch: any;
    pokemons: {
        pokemonsList: IPokemonInfo[]
    }
}

class RandomPokemons extends Component<IProps, IState> {
    state = {
        pokemonsList: []
    }
    componentDidMount() {
        axios.get('http://localhost:3000/api/v1/random-pokemons')
            .then((res: any) => res.data)
            .then((res: IPokemonInfo[])  => {
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
                        <Meta title={d.name} description={d.id}/>
                    </Card>
                </Col>
            );
        })
    }

    handleCardClick = (id: number) => {
        router.push(`/pokemoninfo/${id}`);
    }

    render() {
        const { pokemonsList } = this.state;
        return (
            <div>
                <Row type="flex" justify="center" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                    {pokemonsList.map((d: IPokemonInfo) => (
                        <Col span={[4, {xs: 24, sm: 12, md: 6, lg: 6}] as any}>
                            <Card
                                hoverable={true}
                                style={{width: 220, marginBottom: 30 }}
                                cover={<img alt={d.name} src={d.sprite} />}
                                onClick={(id: any) => this.handleCardClick(d.id)}
                            >
                                <Meta title={<span style={{ fontSize: 20, fontWeight: 700 }}>{d.name.toUpperCase()}</span>} description={`#${d.id}`} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }
}

export default connect(({ pokemons }: IPropsState) => ({
    pokemons,
}))(RandomPokemons);
