import React, { Component } from 'react';
import { PokemonInfo as IPokemonInfo } from '../data.d';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Avatar,
  Tag,
  Badge,
  Progress,
  Typography,
  Button,
  Radio,
  Icon,
  Spin
} from 'antd';
import { typesColors, getRandomColors } from './utils/';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import router from 'umi/router';
import Link from 'umi/link';


const { Meta } = Card;
const { Text } = Typography;
const ButtonGroup = Button.Group;

const axios = require('axios');

interface IState {
  currentPokemon: IPokemonInfo;
  id: number;
  loading: boolean;
}

interface IPropsState {
  pokemons: {
    pokemonsList: IPokemonInfo[];
  };
}

class PokemonInfo extends Component<any, IState> {
  state = {
    currentPokemon: {} as IPokemonInfo,
    id: -1,
    loading: true,
  };

  componentDidMount() {
    this.setState({ id: this.props.match.params.id }, () => {
      this.setState({ loading: true });
      axios
        .get(`http://localhost:3000/api/v1/pokemon/${this.state.id}`)
        .then((info: any) => info.data)
        .then((info: IPokemonInfo) => this.setState({ currentPokemon: info }))
        .catch((err: any) => console.error(err))
        .finally(() => setTimeout(() => this.setState({ loading: false }), 1000));
    });
  }

  componentWillUpdate(prevProps: any, nextState: IState) {
    if (this.state.id != nextState.id) {
      this.setState({ loading: true });
      axios
        .get(`http://localhost:3000/api/v1/pokemon/${nextState.id}`)
        .then((info: any) => info.data)
        .then((info: IPokemonInfo) => this.setState({ currentPokemon: info }))
        .catch((err: any) => console.error(err))
        .finally(() => this.setState({ loading: false }));
    }
  }

  getTypes = (currentPokemon: IPokemonInfo) => {
    const { types } = currentPokemon;
    if (!types || types.length < 1) return <div>No Attributes</div>;
    return (
      <div>
        {types.map((type: { name?: string; url?: string }) => (
          <Tag color={typesColors[type.name]}>{type.name}</Tag>
        ))}
      </div>
    );
  };

  getHeldItems = (currentPokemon: IPokemonInfo) => {
    const { held_items } = currentPokemon;
    if (!held_items || held_items.length < 1) return <div>No Attributes</div>;
    return (
      <div>
        {held_items.map((item: { name?: string; url?: string }) => (
          <Tag color={getRandomColors()}>{item.name}</Tag>
        ))}
      </div>
    );
  };

  getProfiles = (currentPokemon: IPokemonInfo) => {
    const { profile } = currentPokemon;
    if (!profile) return <div>No Attributes</div>;
    return (
      <div style={{ textAlign: 'left' }}>
        <Badge color="#2db7f5" text={`Height: ${profile.height}`} />
        <br />
        <Badge color="#2db7f5" text={`Weight: ${profile.weight}`} />
      </div>
    );
  };

  getAbilities = (currentPokemon: IPokemonInfo) => {
    // const { abilities } = currentPokemon['profile'];
    let abilities = undefined;
    if (currentPokemon.profile) {
      abilities = currentPokemon.profile.abilities;
    }
    if (!abilities) return <div>No Attributes</div>;
    return (
      <div style={{ textAlign: 'left' }}>
        {abilities.map((ability: { name?: string; url?: string }) => (
          <span>
            <Badge color="#f50" text={ability.name} />
            <br />
          </span>
        ))}
      </div>
    );
  };

  getStats = (currentPokemon: IPokemonInfo) => {
    const { stats } = currentPokemon;
    if (!stats || stats.length < 1) return <div>No Attributes</div>;
    return (
      <div style={{ textAlign: 'left' }}>
        <ReactEcharts
          option={this.getStatsChartOption(this.getStatsChartData(stats))}
          style={{ height: '300px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    );
  };

  getStatsChartData = (stats: { name?: string; value?: number }[]) => {
    const labels: string[] = [];
    const values: number[] = [];
    stats.map((stat: { name?: string; value?: number }) => {
      labels.push(stat.name);
      values.push(stat.value);
    });
    return { labels, values };
  };

  getStatsChartOption = ({ labels, values }: any) => ({
    xAxis: {
      type: 'value',
    },
    grid: {
      x: 100,
      x2: 20,
    },
    yAxis: {
      type: 'category',
      data: labels,
    },
    series: [
      {
        data: values,
        type: 'bar',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
              { offset: 1, color: '#29b5d6' },
              { offset: 0, color: '#6dd5ed' },
            ]),
          },
        },
      },
    ],
  });

  backwardPage = (value: any) => {
    let { id } = this.state.currentPokemon;
    id = parseInt(id);
    if (id > 1) id -= 1;
    this.setState({ id });
    router.push(`/pokemoninfo/${id}`);
  };

  forwardPage = (value: any) => {
    let { id } = this.state.currentPokemon;
    id = parseInt(id);
    if (id < 300) id += 1;
    this.setState({ id });
    router.push(`/pokemoninfo/${id}`);
  };

  getRandomNumber = (
    min: number,
    max: number,
  ): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  showSpin = (loading: boolean) => {
    if (loading) {
      return <Spin size="large" style={{ marginBottom: 30, display: "block" }} />;
    } else {
      return '';
    }
  };


  render() {
    const { currentPokemon, loading } = this.state;
    const types = this.getTypes(currentPokemon);
    const items = this.getHeldItems(currentPokemon);
    const profiles = this.getProfiles(currentPokemon);
    const abilities = this.getAbilities(currentPokemon);
    const stats = this.getStats(currentPokemon);
    return (
      <div style={{ marginBottom: 50 }}>
        {this.showSpin(loading)}
        {currentPokemon && currentPokemon['message'] && (
          <div>
            <h2>Oops! Something went wrong.</h2>
            <img style={{width: 200}} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${this.getRandomNumber(1, 300)}.png`} />
          </div>
        )}
        {currentPokemon && currentPokemon['id'] && (
          <div>
            <Avatar size={200} src={currentPokemon.sprite} />
            <br />
            <ButtonGroup style={{ marginBottom: 30 }}>
              <Button onClick={this.backwardPage} value="backward">
                <Icon type="left" />
              </Button>
              <Button onClick={this.forwardPage} value="forward">
              <Icon type="right" />
              </Button>
            </ButtonGroup>
            <Descriptions
              title={<span style={{ fontSize: 30 }}>{currentPokemon.name.toUpperCase()}</span>}
              layout="vertical"
              bordered
              column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 1, xs: 1 }}
              style={{ width: '100%' }}
            >
              <Descriptions.Item label="ID">
                {<span style={{ fontWeight: 700 }}>{currentPokemon.id}</span>}
              </Descriptions.Item>
              <Descriptions.Item label="Types">{types}</Descriptions.Item>
              <Descriptions.Item label="Held Items">{items}</Descriptions.Item>
              <Descriptions.Item label="Profile">{profiles}</Descriptions.Item>
              <Descriptions.Item label="Abilities">{abilities}</Descriptions.Item>
              <Descriptions.Item label="Stats">{stats}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <Button style={{marginTop: 30}} type="primary" size="large">
          <Link to="/pokemons">Go to main page</Link>
        </Button>
      </div>
    );
  }
}

export default connect(({ pokemons }: IPropsState) => ({
  pokemons,
}))(PokemonInfo);
