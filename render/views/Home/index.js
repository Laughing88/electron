import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import store from './store';
import './index.css';

const { Content } = Layout;

@observer
class Home extends React.Component {

  componentDidMount() {
    store.initValue();
  }


  render() {
    return (
        <div>hello word electron</div>
    );
  }
}

export default Home;
