import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin, Input, Alert } from 'antd';
import { PokemonInfo as IPokemonInfo } from '../../data.d';
import Link from 'umi/link';
import router from 'umi/router';
import style from '../index.css';

const { Meta } = Card;
const { Search } = Input;
const axios = require('axios');
const serverIp = process.env.SERVER_IP || "localhost";

interface IState {
  loading: boolean;
  pokemonsList: IPokemonInfo[];
  serachError: boolean
}

interface IPropsState {
  pokemons: {
    pokemonsList: IPokemonInfo[];
  };
}

interface IProps {
  dispatch: any;
  pokemons: {
    pokemonsList: IPokemonInfo[];
  };
}

class RandomPokemons extends Component<IProps, IState> {
  state = {
    pokemonsList: [],
    loading: true,
    serachError: false
  };
  componentDidMount() {
    this.setState({ loading: true }, () => {
      axios
        .get(`http://${serverIp}:3000/api/v1/random-pokemons`)
        .then((res: any) => res.data)
        .then((res: IPokemonInfo[]) => {
          this.setState({ pokemonsList: res });
          const { dispatch } = this.props;
          dispatch({
            type: 'pokemons/save',
            payload: res,
          });
        })
        .finally(setTimeout(() => this.setState({ loading: false }), 1000));
    });
  }

  displayCards = (data: any[]) => {
    // if(!data) return;
    data.map((d: any) => {
      console.log(d.sprite);
      return (
        <Col span={6}>
          <Card hoverable={true} style={{ width: 240 }} cover={<img alt={d.name} src={d.sprite} />}>
            <Meta title={d.name} description={d.id} />
          </Card>
        </Col>
      );
    });
  };

  handleCardClick = (id: number) => {
    router.push(`/pokemoninfo/${id}`);
  };

  showSpin = (loading: boolean) => {
    if (loading) {
      return <Spin size="large" style={{ marginBottom: 30, display: "block" }} />;
    } else {
      return '';
    }
  };

  handleSearch = (value: any) => {
    const valueInt = parseInt(value);
    if(valueInt && valueInt > 0 && valueInt < 300) {
        this.setState({serachError: false})
        router.push(`/pokemoninfo/${valueInt}`);
    } else if (!valueInt) {
        this.setState({serachError: false})
        router.push(`/pokemoninfo/${value}`);
    } else {
        this.setState({serachError: true})
    }
  }

  render() {
    const { pokemonsList } = this.state;
    const { loading, serachError } = this.state;
    return (
      <div>
        <Search
          placeholder="Enter Pokémon's name or ID"
          enterButton="Search"
          size="large"
          onSearch={this.handleSearch}
          style={{marginBottom: 20, width: "80%"}}
        />
        {serachError && (<Alert style={{ width: '80%', marginBottom: 30, margin: "auto" }} message="Pokémon ID should be beteen 1 and 300." type="error" />)}
        {this.showSpin(loading)}
        <Row type="flex" justify="center" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} style={{ marginTop: 30 }}>
          {pokemonsList.map((d: IPokemonInfo) => (
            <Col span={[4, { xs: 24, sm: 12, md: 6, lg: 6 }] as any}>
              <Card
                hoverable={true}
                style={{ width: 220, marginBottom: 30 }}
                cover={<img alt={d.name} src={d.sprite} />}
                onClick={(id: any) => this.handleCardClick(d.id)}
              >
                <Meta
                  title={
                    <span style={{ fontSize: 20, fontWeight: 700 }}>{d.name.toUpperCase()}</span>
                  }
                  description={`#${d.id}`}
                />
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
